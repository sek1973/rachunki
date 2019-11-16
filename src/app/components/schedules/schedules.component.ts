import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Schedule } from 'src/app/model/schedule';

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
    public dialog: MatDialog) { }

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

  openDialog(): void {
    const schedule: Schedule = this.table.activeRow;
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '500px',
      data: { schedule: schedule }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
