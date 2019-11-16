import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Schedule } from 'src/app/model/schedule';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { SchedulesDataSource } from './../../services/schedules.datasource';
import { SchedulesFirebaseService } from './../../services/schedules.firebase.service';
import { TableComponent } from './../tools/table/table.component';
import { ScheduleDialogComponent } from './schedule-dialog/schedule-dialog.component';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {
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

  dataSource: SchedulesDataSource;
  columns = [
    { name: 'date', header: 'Termin' },
    { name: 'sum', header: 'Kwota' },
    { name: 'remarks', header: 'Uwagi' }
  ];

  constructor(private schedulesFirebaseService: SchedulesFirebaseService,
    public dialog: MatDialog,
    private confirmationService: ConfirmationService) { }

  ngOnInit() { }

  private setTableDataSource() {
    this.dataSource = new SchedulesDataSource(this.schedulesFirebaseService, this.billUid);
    this.dataSource.load();
  }

  onRowClicked(row) {
    if (this.activeRow !== row) {
      this.activeRow = row;
    }
  }

  getId(row: Schedule): string {
    return row.uid;
  }

  refresh() {
    this.dataSource.load();
  }

  addSchedule() {
    this.openDialog(undefined);
  }

  editSchedule() {
    if (this.table.activeRow) { this.openDialog(this.table.activeRow); }
  }

  private openDialog(schedule: Schedule): void {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '500px',
      data: { schedule: schedule, billUid: this.billUid }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  deleteSchedule() {
    if (this.table.activeRow) {
      this.confirmationService
        .confirm('Usuń planowaną płatność', 'Czy na pewno chcesz usunąć tę płatność?', 'Nie', 'Tak')
        .subscribe((response) => {
          if (response) this.schedulesFirebaseService.delete(this.table.activeRow, this.billUid);
        });
    }
  }

  onRowActivated(row: Schedule) {
    this.table.canDelete = row ? true : false;
    this.table.canEdit = row ? true : false;
  }

}
