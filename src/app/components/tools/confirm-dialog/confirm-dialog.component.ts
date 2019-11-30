import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { DescriptionProvider } from '../inputs/input-component-base';
import { ConfirmDialogModel, ConfirmDialogInputType } from './confirm-dialog.model';

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

  form: FormGroup;
  inputType: ConfirmDialogInputType;
  confirmDialogInputType = ConfirmDialogInputType;
  descriptionProvider: DescriptionProvider;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel
  ) {
    this.dialogTitle = data.dialogTitle;
    this.message = data.message;
    this.cancelButtonLabel = data.cancelButtonLabel;
    this.applyButtonLabel = data.applyButtonLabel;
    this.initInput(data);
  }

  ngOnInit() { }

  initInput(data: ConfirmDialogModel) {
    if (data.inputType !== undefined) {
      this.inputType = data.inputType;
      this.descriptionProvider = {
        getDescriptionObj: (...path: string[]) => {
          return {
            tooltipText: data.inputTooltipText,
            placeholderText: data.inputPlaceholderText,
            labelText: data.inputLabelText
          };
        }
      };
      this.form = new FormGroup({ input: new FormControl(data.inputValidators) });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onApply() {
    this.dialogRef.close(true);
  }
}
