import { Input, OnInit } from '@angular/core';

export interface ValueProvider {
  getValue(...path: string[]): any;
}

export interface LabelProvider {
  getLabelText(...path: string[]): string;
}

export class ViewFieldComponentBase implements OnInit {
  @Input() valueProvider: ValueProvider;
  @Input() labelProvider: LabelProvider;
  private _path: string[];
  @Input()
  set path(path: string[]) {
    this._path = path;
    if (path && path.length) {
      this._childPath = path[path.length - 1];
      this.id = path.join(':');
    } else {
      this._childPath = undefined;
    }
  }
  get path(): string[] {
    return this._path;
  }
  private _childPath: string;
  get childAttr() {
    return this._childPath;
  }
  get value(): any {
    return this.valueProvider.getValue(...this.path);
  }
  get labelText(): any {
    return this.labelProvider.getLabelText(...this.path);
  }
  id: string;

  constructor() { }

  ngOnInit() { }
}
