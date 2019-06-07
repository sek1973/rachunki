import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { FirebaseService } from './services/firebase.service';
import { RachunkiDataSource } from './services/rachunki.datasource';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
  // animation fix based on: https://github.com/angular/material2/issues/11990
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'rachunki';
  expandedRow: any;
  activeRow: any;

  dataSource: RachunkiDataSource;
  dataColumns = [ 'id', 'nazwa', 'opis' ];
  columns = [ '_expand', ...this.dataColumns ];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.dataSource = new RachunkiDataSource(this.firebaseService);
    this.dataSource.wczytajRachunki();
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }

  onRowClick(row: any) {
    if (this.activeRow !== row) {
      this.activeRow = row;
    }
  }

  onRowExpandClick(row: any) {
    if (this.expandedRow === row) {
      this.expandedRow = undefined;
    } else {
      this.expandedRow = row;
    }
  }
}
