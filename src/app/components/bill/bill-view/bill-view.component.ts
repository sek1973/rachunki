import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill } from 'src/app/model/bill';

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.scss']
})
export class BillViewComponent implements OnInit {

  private _bill: Bill;
  @Input() set bill(val: Bill) {
    this._bill = val;
  }
  get bill(): Bill {
    return this._bill;
  }
  @Output() editModeChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  editBill() {
    this.editModeChange.emit(true);
  }

  payBill() {
    alert('bill paid!');
  }
}
