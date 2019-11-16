import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';
import { getSafe } from 'src/app/helpers';
import { Schedule } from 'src/app/model/schedule';

export interface ScheduleDialogData {
  schedule?: Schedule
}
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit {

  schedule: Schedule;
  dialogTitle: string;
  dialogMode: 'add' | 'edit' = 'add';
  loading = true;

  form: FormGroup = new FormGroup({
    uid: new FormControl,
    deadline: new FormControl(),
    sum: new FormControl(),
    description: new FormControl()
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ScheduleDialogData,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>) {
    this.schedule = getSafe(() => data.schedule);
    this.dialogTitle = (this.schedule ? 'Edytuj' : 'Dodaj') + ' planowaną płatność';
    this.dialogMode = this.schedule ? 'edit' : 'add';
    this.loading = false;
  }

  ngOnInit() {
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }

  saveData() {
    this.loading = true;
    const request = of({})
      .pipe(
        delay(1000),
        mergeMap(() => this.schedule ? of(true) : of(false)),
        delay(1000));
    request.subscribe(resp => {
      this.dialogRef.close('saved');
    },
      error => {
        console.error(error);
        this.loading = false;
      });
  }

  cloneData() {

  }

}
