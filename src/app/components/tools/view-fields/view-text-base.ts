import { Input, OnInit } from '@angular/core';

export interface ValueProvider {
  getValue(...path: string[]): any;
}

export interface LabelProvider {
  getLabelText(...path: string[]): string;
}

export class ViewFieldComponentBase implements OnInit {
  @Input() id: string;
  @Input() noLine = false;

  @Input() valueProvider: ValueProvider;
  @Input() labelProvider: LabelProvider;
  private _attrPath: string[];
  @Input()
  set attrPath(path: string[]) {
    this._attrPath = path;
    if (path && path.length) this._childAttr = path[path.length - 1];
    else this._childAttr = undefined;
  }
  get attrPath(): string[] {
    return this._attrPath;
  }
  private _childAttr: string;
  get childAttr() {
    return this._childAttr;
  }
  get value(): any {
    return this.valueProvider.getValue(...this.attrPath);
  }
  get labelText(): any {
    return this.labelProvider.getLabelText(...this.attrPath);
  }

  constructor() { }

  ngOnInit() { }
}
