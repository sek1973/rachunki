import { AbstractControl, ValidatorFn } from '@angular/forms';

export function validateBillName(billName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    console.log('wrong name validation');
    if (control.value === billName) {
      return null;
    } else {
      return { 'wrongName': { value: control.value } };
    }
  };
}
