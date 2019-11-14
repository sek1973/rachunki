import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Schedule } from 'src/app/model/schedule';

import { FirebaseService } from './../../services/firebase.service';
import { SchedulesDataSource } from './../../services/schedules.datasource';
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

  activeRow: any;

  dataSource: SchedulesDataSource;
  columns = [
    { name: 'date', header: 'Termin' },
    { name: 'sum', header: 'Kwota' },
    { name: 'remarks', header: 'Uwagi' }
  ];

  constructor(private firebaseService: FirebaseService,
    public dialog: MatDialog) { }

  ngOnInit() { }

  private setTableDataSource() {
    this.dataSource = new SchedulesDataSource(this.firebaseService, this.billUid);
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

  addDialog(): void {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '250px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  editDialog(): void {
    const dialogRef = this.dialog.open(ScheduleDialogComponent, {
      width: '250px',
      data: { mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
