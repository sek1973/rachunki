import { Component, Input, OnInit } from '@angular/core';

import { InputComponentBase } from './../input-component-base';

export interface SelectItem {
  value: any;
  text: string;
}

export function enumToSelectItems(enumStructure: any): SelectItem[] {
  const result = Object.keys(enumStructure)
    .filter(value => isNaN(Number(value)) === false)
    .map(key => ({ text: enumStructure[key], value: +key }));
  return result;
}

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss']
})
export class InputSelectComponent extends InputComponentBase implements OnInit {

  @Input() selectItems: SelectItem[];

  constructor() { super(); }

  ngOnInit() {
  }

}
