import { InputComponentBase } from './../input-component-base';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent extends InputComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
