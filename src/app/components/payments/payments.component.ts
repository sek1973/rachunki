import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { Payment } from './../../model/payment';
import { PaymentsDataSource } from './../../services/payments.datasource';
import { PaymentsFirebaseService } from './../../services/payments.firebase.service';
import { TableComponent } from './../tools/table/table.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';

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
  @ViewChild('table', { static: false, read: TableComponent }) table: TableComponent;

  activeRow: any;

  dataSource: PaymentsDataSource;
  columns = [
    { name: 'deadline', header: 'Termin' },
    { name: 'paiddate', header: 'Zapłacono' },
    { name: 'sum', header: 'Kwota' },
    { name: 'share', header: 'Udział' },
    { name: 'remarks', header: 'Uwagi' }
  ];

  constructor(private paymentsFirebaseService: PaymentsFirebaseService,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService,
    private snackBar: MatSnackBar) { }

  ngOnInit() { }

  private setTableDataSource() {
    this.dataSource = new PaymentsDataSource(this.paymentsFirebaseService, this.billUid);
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

  addPayment() {
    this.openDialog(undefined);
  }

  editPayment() {
    if (this.table.activeRow) { this.openDialog(this.table.activeRow); }
  }

  private openDialog(payment: Payment): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '500px',
      data: { payment: payment, billUid: this.billUid }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  deletePayment() {
    if (this.table.activeRow) {
      this.confirmationService
        .confirm('Usuń zrealizowaną płatność', 'Czy na pewno chcesz usunąć tę płatność z historii?', 'Nie', 'Tak')
        .subscribe((response) => {
          if (response) {
            this.paymentsFirebaseService.delete(this.table.activeRow, this.billUid).then(
              () => this.snackBar.open('Usunięto płatność.', 'Ukryj', { duration: 3000 }),
              error => this.snackBar.open('Błąd usuwania płatności: ' + error, 'Ukryj', { panelClass: 'snackbar-style-error' }));
          }
        });
    }
  }

  onRowActivated(row: Payment) {
    this.table.canDelete = row ? true : false;
    this.table.canEdit = row ? true : false;
  }

}
