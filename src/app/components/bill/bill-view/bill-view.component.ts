import { PercentPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill } from 'src/app/model/bill';

import { DescriptionProvider } from '../../tools/inputs/input-component-base';
import { BillDescription } from './../../../model/bill';
import { CurrencyToStringPipe } from './../../../pipes/currency-to-string.pipe';
import { TimespanToStringPipe } from './../../../pipes/timespan-to-string.pipe';
import { ValueProvider } from './../../tools/view-fields/view-text-base';

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
  currencyToStringPipe = CurrencyToStringPipe;
  timespanToStringPipe = TimespanToStringPipe;
  percentPipe = PercentPipe;

  constructor() { }

  ngOnInit() {
  }

  editBill() {
    this.editModeChange.emit(true);
  }

  payBill() {
    alert('bill paid!');
  }

  getValue(...path: string[]) {
    return this.bill[path[0]];
  }

  getValueProvider(): ValueProvider {
    return { getValue: (...path: string[]) => this.getValue(...path) }
  }

  getDescriptionProvider(): DescriptionProvider {
    return {
      getDescriptionObj: (...path: string[]) => BillDescription.get(path[0])
    };
  }

}
