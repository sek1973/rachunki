import { Component, Input, OnInit } from '@angular/core';

import { InputComponentBase } from './../input-component-base';

export interface SelectItem {
  value: any;
  text: string;
}

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss']
})
export class InputSelectComponent extends InputComponentBase implements OnInit {

  @Input() slectItems: SelectItem[];

  constructor() { super(); }

  ngOnInit() {
  }

}
