import { SelectItem } from './../../tools/inputs/input-select/input-select.component';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Bill } from 'src/app/model/bill';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { DescriptionProvider } from '../../tools/inputs/input-component-base';
import { enumToSelectItems } from '../../tools/inputs/input-select/input-select.component';
import { BillDescription } from './../../../model/bill';
import { Unit } from './../../../model/unit';
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
    Promise.resolve().then(() => this.loadBill());
  }
  get bill(): Bill {
    return this._bill;
  }
  @Input() newBill: boolean;
  @Input() editMode: boolean = false;
  canSave = false;

  unitEnumItems: SelectItem[] = [];

  form: FormGroup = new FormGroup({
    uid: new FormControl(),
    id: new FormControl(),
    name: new FormControl('Nowy rachunek', Validators.required),
    description: new FormControl(),
    active: new FormControl(true, Validators.required),
    deadline: new FormControl(new Date(), Validators.required),
    repeat: new FormControl(1),
    unit: new FormControl(Unit.Month),
    reminder: new FormControl(new Date(), Validators.required),
    sum: new FormControl(),
    share: new FormControl(1, Validators.required),
    url: new FormControl(),
    login: new FormControl(),
    password: new FormControl()
  });

  constructor(private billsFirebaseService: BillsFirebaseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute) {
    this.form.statusChanges.subscribe(status => this.setEditStatus(status));
    this.setUnitEnumItems();
  }

  ngOnInit() {
  }

  private loadBill() {
    if (this.bill) {
      this.form.patchValue({
        uid: this.bill.uid,
        id: this.bill.id,
        name: this.bill.name,
        description: this.bill.description,
        active: this.bill.active,
        deadline: this.bill.deadline ? this.bill.deadline.toDate() : undefined,
        repeat: this.bill.repeat,
        unit: this.bill.unit,
        reminder: this.bill.reminder ? this.bill.reminder.toDate() : undefined,
        sum: this.bill.sum,
        share: this.bill.share,
        url: this.bill.url,
        login: this.bill.login,
        password: this.bill.password
      });
    }
    this.setEditStatus(this.form.status);
  }

  editBill() {
    console.log('form value: ', this.form.value);
    this.editMode = true;
  }

  payBill() {
    this.billsFirebaseService.pay(this.bill);
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
    console.log('form value: ', this.form.value);
    if (this.newBill) {
      this.router.navigate(['/zestawienie']);
    } else {
      this.editMode = false;
      this.loadBill();
    }
  }

  private setBill(bill: Bill) {
    if (bill.uid) {
      this.billsFirebaseService.update(bill).then(() => this.editMode = false);
    } else {
      this.billsFirebaseService.add(bill)
        .then((ref) => {
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

  getDescriptionProvider(): DescriptionProvider {
    return {
      getDescriptionObj: (...path: string[]) => BillDescription.get(path[0])
    };
  }

  private setUnitEnumItems() {
    this.unitEnumItems = enumToSelectItems(Unit);
  }

  private setEditStatus(status: string) {
    this.canSave = status === 'VALID' ? true : false;
  }

}
