import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { getSafe, timestampToDate } from 'src/app/helpers';
import { Payment } from 'src/app/model/payment';

import { ConfirmationService } from './../../../services/confirmation.service';
import { PaymentsFirebaseService } from './../../../services/payments.firebase.service';

export interface PaymentDialogData {
  billUid: string,
  payment?: Payment
}
@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {

  payment: Payment;
  billUid: string;
  dialogTitle: string;
  dialogMode: 'add' | 'edit' = 'add';
  loading = true;

  form: FormGroup = new FormGroup({
    uid: new FormControl,
    deadline: new FormControl(),
    paiddate: new FormControl(),
    sum: new FormControl(),
    share: new FormControl(),
    remarks: new FormControl()
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: PaymentDialogData,
    public dialogRef: MatDialogRef<PaymentDialogComponent>,
    private paymentsFirebaseService: PaymentsFirebaseService,
    private confirmationService: ConfirmationService) {
    this.billUid = getSafe(() => data.billUid);
    this.payment = getSafe(() => data.payment);
    this.dialogTitle = (this.payment ? 'Edytuj' : 'Dodaj') + ' zrealizowaną płatność';
    this.dialogMode = this.payment ? 'edit' : 'add';
    this.loading = false;
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.setFormValue());
  }

  private setFormValue(): void {
    if (this.payment) {
      const value = {
        uid: this.payment.uid,
        deadline: timestampToDate(this.payment.deadline),
        paiddate: timestampToDate(this.payment.paiddate),
        sum: this.payment.sum,
        share: this.payment.share,
        remarks: this.payment.remarks
      }
      this.form.patchValue(value);
    }
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }

  saveData() {
    let request: Promise<firebase.firestore.DocumentReference | void>;
    this.loading = true;
    if (this.payment) {
      request = this.paymentsFirebaseService.update(this.form.value, this.billUid);
    } else {
      request = this.paymentsFirebaseService.add(this.form.value, this.billUid);
    }
    request.then(resp => {
      this.dialogRef.close('saved');
    },
      error => {
        console.error(error);
        this.loading = false;
      });
  }

}
