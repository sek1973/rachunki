import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { getSafe, timestampToDate } from 'src/app/helpers';
import { Schedule } from 'src/app/model/schedule';
import { ConfirmationService } from 'src/app/services/confirmation.service';

import { SchedulesFirebaseService } from './../../../services/schedules.firebase.service';

export interface ScheduleDialogData {
  billUid: string,
  schedule?: Schedule
}
@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.scss']
})
export class ScheduleDialogComponent implements OnInit, AfterViewInit {

  schedule: Schedule;
  billUid: string;
  dialogTitle: string;
  dialogMode: 'add' | 'edit' = 'add';
  loading = true;

  form: FormGroup = new FormGroup({
    uid: new FormControl,
    date: new FormControl(),
    sum: new FormControl(),
    remarks: new FormControl()
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ScheduleDialogData,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private schedulesFirebaseService: SchedulesFirebaseService,
    private confirmationService: ConfirmationService) {
    this.billUid = getSafe(() => data.billUid);
    this.schedule = getSafe(() => data.schedule);
    this.dialogTitle = (this.schedule ? 'Edytuj' : 'Dodaj') + ' planowaną płatność';
    this.dialogMode = this.schedule ? 'edit' : 'add';
    this.loading = false;
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => this.setFormValue());
  }

  private setFormValue(): void {
    if (this.schedule) {
      const value = {
        uid: this.schedule.uid,
        date: timestampToDate(this.schedule.date),
        sum: this.schedule.sum,
        remarks: this.schedule.remarks
      }
      this.form.patchValue(value);
    }
  }

  closeDialog() {
    this.dialogRef.close('cancel');
  }

  saveData() {
    let request: Promise<firebase.firestore.DocumentReference | void>;
    this.loading = true;
    if (this.schedule) {
      request = this.schedulesFirebaseService.update(this.form.value, this.billUid);
    } else {
      request = this.schedulesFirebaseService.add(this.form.value, this.billUid);
    }
    request.then(resp => {
      this.dialogRef.close('saved');
    },
      error => {
        console.error(error);
        this.loading = false;
      });
  }

  private checkDuplicatedSchedule() {
    this.confirmationService
      .confirm('Powtórzony plan', 'Plan płatności z tą datą już istnieje. Czy na pewno dodać nowy?', 'Nie', 'Tak')
      .subscribe((response) => {
        if (response) console.log('sukces');
      });
  }

  cloneData() {
    this.loading = true;
    const request = this.schedulesFirebaseService.add(this.form.value, this.billUid);
    request.then(resp => {
      console.log('schedule cloned');
      this.loading = false;
    },
      error => {
        console.error(error);
        this.loading = false;
      });
  }

}
