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

  @Input() autoHide: boolean = true;
  private _formGroup: FormGroup;
  @Input() set formGroup(val: FormGroup) {
    this._formGroup = val;
    this.setChildFormGroup();
  }
  get formGroup(): FormGroup {
    return this._formGroup;
  }
  @Input() descriptionProvider: DescriptionProvider;
  private _editMode: boolean = true;
  @Input() set editMode(val: boolean) {
    this._editMode = val;
    this.setFormGroupState();
  }
  get editMode(): boolean {
    return this._editMode;
  }

  get labelText(): string {
    return getSafe(() => this.descriptionProvider.getDescriptionObj(...this.path).labelText) || '';
  }

  get tooltipText(): string {
    return getSafe(() => this.descriptionProvider.getDescriptionObj(...this.path).tooltipText) || '';
  }

  get placeholderText(): string {
    return getSafe(() => this.descriptionProvider.getDescriptionObj(...this.path).placeholderText) || '';
  }

  get visible(): boolean {
    if (this.autoHide) {
      if (!this.editMode) {
        const controlValue = getSafe(() => this.childFormGroup.get(this.fieldName).value);
        return controlValue === undefined || controlValue === null || controlValue === '' ? false : true;
      }
    }
    return true;
  }

  private setFormGroupState(): void {
    if (this.childFormGroup) {
      if (this.editMode) {
        this.childFormGroup.enable();
      } else {
        this.childFormGroup.disable();
      }
    }
  }

  private _path: string[];
  @Input()
  set path(val: string[]) {
    this._path = val;
    this.setFieldName();
    this.setChildFormGroup();
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
    this.setFormGroupState();
  }

  private setFieldName() {
    if (this.path && this.path.length) {
      this._fieldName = this.path[this.path.length - 1];
    } else { this._fieldName = undefined; }
  }

  private setChildFormGroup(): void {
    if (this.formGroup && this.fieldName) {
      if (this.formGroup.get(this.fieldName) !== null) {
        this.childFormGroup = this.formGroup;
      }
      if (this.path.length > 1) {
        const parentFgPath = this.path.slice(0, -1);
        const parentFg = <FormGroup>this.formGroup.get(parentFgPath);
        if (parentFg !== null) {
          this.childFormGroup = parentFg;
        }
      }
      this.childFormGroup = this.formGroup;
    }
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
