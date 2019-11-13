import { Component, Input, OnInit } from '@angular/core';
import { Schedule } from 'src/app/model/schedule';

import { FirebaseService } from './../../services/firebase.service';
import { SchedulesDataSource } from './../../services/schedules.datasource';

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

  constructor(private firebaseService: FirebaseService) { }

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

}
