import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  canSave = false;

  form: FormGroup = new FormGroup({
    uid: new FormControl,
    deadline: new FormControl(new Date(), Validators.required),
    paiddate: new FormControl(new Date(), Validators.required),
    sum: new FormControl(0, Validators.required),
    share: new FormControl(0, Validators.required),
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
    this.form.statusChanges.subscribe(status => this.setEditStatus(status))
    this.loading = false;
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.setFormValue());
  }

  private setEditStatus(status: string) {
    this.canSave = status === 'VALID' ? true : false;
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
    this.setEditStatus(this.form.status);
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
