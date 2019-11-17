import { getSafe } from 'src/app/helpers';
import { Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldDescription } from 'src/app/model/field-description';

export interface DescriptionProvider {
  getDescriptionObj: (...path: string[]) => FieldDescription
}
export class InputComponentBase implements OnInit {
  tooltipShowDelayValue = 1000;
  tooltipHideDelayValue = 2000;
  childFormGroup: FormGroup;

  @Input() formGroup: FormGroup;
  @Input() descriptionProvider: DescriptionProvider;

  get tooltipText(): string {
    return getSafe(() => this.descriptionProvider.getDescriptionObj(...this.path).tooltipText) || '';
  }

  get placeholderText(): string {
    return getSafe(() => this.descriptionProvider.getDescriptionObj(...this.path).placeholderText) || '';
  }

  private _path: string[];
  @Input()
  set path(val: string[]) {
    this._path = val;
    if (val && val.length) {
      this._fieldName = val[val.length - 1];
    } else { this._fieldName = undefined; }
  }
  get path(): string[] {
    return this._path;
  }

  private _fieldName: string;
  get fieldName() {
    return this._fieldName;
  }

  constructor() { }

  ngOnInit() {
    this.childFormGroup = this.findFormGroup(this.formGroup);
  }

  private findFormGroup(fg: FormGroup): FormGroup {
    if (fg.get(this._fieldName) !== null) {
      return fg;
    }
    if (this.path.length > 1) {
      const parentFgPath = this.path.slice(0, -1);
      const parentFg = <FormGroup>fg.get(parentFgPath);
      if (parentFg !== null) {
        return parentFg;
      }
    }
    return fg;
  }

  getErrorMessage(...path: string[]): string {
    const formControl = this.formGroup.get(path);
    if (formControl !== null) {
      const errors = formControl.errors;
      if (errors && errors.values) {
        return errors.values.join('\n');
      }
    }
    return 'Invalid value provided';
  }
}
