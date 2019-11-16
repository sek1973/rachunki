import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ConfirmDialogModel } from './confirm-dialog.model';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  dialogTitle: string;
  message: string;
  cancelButtonLabel: string;
  applyButtonLabel: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
    this.cancelButtonLabel = data.cancelButtonLabel;
    this.applyButtonLabel = data.applyButtonLabel;
  }

  ngOnInit() { }

  onCancel() {
    this.dialogRef.close(false);
  }

  onApply() {
    this.dialogRef.close(true);
  }
}
