import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, Input } from '@angular/core';

import { Payment } from './../../model/payment';
import { FirebaseService } from './../../services/firebase.service';
import { PaymentsDataSource } from './../../services/payments.datasource';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  // animation fix based on: https://github.com/angular/material2/issues/11990
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({
        height: '0px',
        minHeight: '0',
        display: 'none'
      })),
      state('expanded', style({
        height: '*'
      })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PaymentsComponent implements OnInit {
  @Input() billUid: string;
  activeRow: any;

  dataSource: PaymentsDataSource;
  dataColumns = [
    { name: 'deadline', header: 'Termin' },
    { name: 'paidDate', header: 'Zapłacono' },
    { name: 'sum', header: 'Kwota' },
    { name: 'remarks', header: 'Uwagi' }
  ];
  columns = [...this.dataColumns.map(column => column.name)];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.dataSource = new PaymentsDataSource(this.firebaseService, this.billUid);
    this.dataSource.loadBills();
  }

  onRowClicked(row) {
    if (this.activeRow !== row) {
      this.activeRow = row;
    }
  }

  getValue(row: Payment, column: string): string {
    switch (column) {
      case 'deadline':
      case 'paidDate':
        return row[column] ? row[column].toDate().toISOString().substring(0, 10) : undefined;
      case 'sum':
        const formatter = new Intl.NumberFormat('pl-PL', {
          style: 'currency',
          currency: 'PLN',
        });
        return formatter.format(row[column]);
      default:
        return row[column];
    }
  }

  getId(row: Payment): string {
    return row.uid;
  }

}
