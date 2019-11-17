import { Component, OnInit } from '@angular/core';

import { ViewFieldComponentBase } from './../view-text-base';

@Component({
  selector: 'app-view-field-text',
  templateUrl: './view-field-text.component.html',
  styleUrls: ['./view-field-text.component.scss']
})
export class ViewFieldTextComponent extends ViewFieldComponentBase implements OnInit {

  constructor() { super(); }

  ngOnInit() {
  }

}
