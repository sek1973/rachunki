import { Component, OnInit } from '@angular/core';

import { InputComponentBase } from './../input-component-base';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss']
})
export class InputTextareaComponent extends InputComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
