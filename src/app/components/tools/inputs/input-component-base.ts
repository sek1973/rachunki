import { FormGroup } from '@angular/forms';
import { OnInit, Input } from '@angular/core';

export class InputComponentBase implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() tooltipText: string;
  @Input() placeholderText: string;
  @Input() locked = false;

  tooltipShowDelayValue = 1000;
  tooltipHideDelayValue = 2000;

  childFormGroup: FormGroup;
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
