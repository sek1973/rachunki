import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Payment } from './../../model/payment';
import { FirebaseService } from './../../services/firebase.service';
import { PaymentsDataSource } from './../../services/payments.datasource';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  private _builUid: string;
  @Input() set billUid(val: string) {
    this._builUid = val;
    this.setTableDataSource();
  }
  get billUid(): string {
    return this._builUid;
  }

  activeRow: any;

  dataSource: PaymentsDataSource;
  columns = [
    { name: 'deadline', header: 'Termin' },
    { name: 'paidDate', header: 'Zapłacono' },
    { name: 'sum', header: 'Kwota' },
    { name: 'remarks', header: 'Uwagi' }
  ];

  constructor(private firebaseService: FirebaseService,
    public dialog: MatDialog) { }

  ngOnInit() { }

  private setTableDataSource() {
    this.dataSource = new PaymentsDataSource(this.firebaseService, this.billUid);
    this.dataSource.load();
  }

  onRowClicked(row) {
    if (this.activeRow !== row) {
      this.activeRow = row;
    }
  }

  getId(row: Payment): string {
    return row.uid;
  }

  refresh() {
    this.dataSource.load();
  }

  addDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '250px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editDialog(): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '250px',
      data: { mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
