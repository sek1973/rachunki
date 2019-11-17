import { BillDescription } from './../../../model/bill';
import { ValueProvider, LabelProvider } from './../../tools/view-fields/view-text-base';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bill } from 'src/app/model/bill';
import { DescriptionProvider } from '../../tools/inputs/input-component-base';

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
