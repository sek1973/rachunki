import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bill } from 'src/app/model/bill';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { BillsFirebaseService } from './../../../services/bills.firebase.service';

@Component({
  selector: 'app-bill-edit',
  templateUrl: './bill-edit.component.html',
  styleUrls: ['./bill-edit.component.scss']
})
export class BillEditComponent implements OnInit {

  private _bill: Bill;
  @Input() set bill(val: Bill) {
    this._bill = val;
    this.loadBill();
  }
  get bill(): Bill {
    return this._bill;
  }
  @Input() newBill: boolean;
  @Output() editModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  form: FormGroup = new FormGroup({
    id: new FormControl,
    uid: new FormControl,
    name: new FormControl(),
    description: new FormControl(),
    url: new FormControl(),
    active: new FormControl(),
    login: new FormControl(),
    password: new FormControl(),
    share: new FormControl(),
    sum: new FormControl(),
    deadline: new FormControl()
  });

  constructor(private billsFirebaseService: BillsFirebaseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  private loadBill() {
    if (this.bill) {
      this.form.patchValue({
        id: this.bill.id,
        uid: this.bill.uid,
        name: this.bill.name,
        description: this.bill.description,
        url: this.bill.url,
        active: this.bill.active,
        login: this.bill.login,
        password: this.bill.password
      });
      console.log('bill data:', this.bill);
    }
  }

  saveBill() {
    this.setBill(this.form.value);
  }

  deleteBill() {
    if (!this.newBill) {
      this.confirmationService
        .confirm('Usuń rachunek', 'Czy na pewno chcesz usunąć bieżący rachunek wraz z historią płatności? Operacji nie będzie można cofnąć!', 'Nie', 'Tak')
        .subscribe((response) => {
          if (response) this.billsFirebaseService.delete(this.bill).then(() => this.router.navigate(['/zestawienie']));
        });
    }
  }

  cancel() {
    if (this.newBill) {
      this.router.navigate(['/zestawienie']);
    } else {
      this.editModeChange.emit(false);
    }
  }

  private setBill(bill: Bill) {
    if (bill.uid) {
      this.billsFirebaseService.update(bill);
    } else {
      this.billsFirebaseService.add(bill)
        .then((ref) => {
          console.log('Document successfully added!', ref, bill);
          this.router.navigate([bill.id], { relativeTo: this.route });
        }).catch((error) => console.error('Error adding document: ', error));
    }
  }

  getErrorMessage(...path: string[]): string {
    const formControl = this.form.get(path);
    if (formControl !== null) {
      const errors = formControl.errors;
      if (errors) {
        return errors.values().join('\n');
      }
    }
    return 'Invalid value provided';
  }

}
