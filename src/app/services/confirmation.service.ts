import { ConfirmDialogComponent } from './../components/tools/confirm-dialog/confirm-dialog.component';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
import { ConfirmDialogModel } from '../components/tools/confirm-dialog/confirm-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(private dialog: MatDialog) { }

  confirm(
    dialogTitle: string,
    message: string,
    cancelButtonLabel = 'Cancel',
    applyButtonLabel = 'Apply'
  ): Observable<boolean> {
    const dialogData = new ConfirmDialogModel(dialogTitle, message, cancelButtonLabel, applyButtonLabel);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '600px',
      data: dialogData
    });
    return dialogRef.afterClosed();
  }
}