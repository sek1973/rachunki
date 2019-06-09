import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

import { FirebaseService } from './../../services/firebase.service';
import { RachunkiDataSource } from './../../services/rachunki.datasource';
import { Rachunek } from 'src/app/model/rachunek';

@Component({
  selector: 'app-zestawienie',
  templateUrl: './zestawienie.component.html',
  styleUrls: [ './zestawienie.component.scss' ],
  // animation fix based on: https://github.com/angular/material2/issues/11990
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ZestawienieComponent implements OnInit {
  expandedRow: any;
  activeRow: any;

  dataSource: RachunkiDataSource;
  dataColumns = [ 'nazwa', 'termin', 'kwota' ];
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

  pokazWartosc(wiersz: Rachunek, kolumna: string): string {
    switch (kolumna) {
      case 'termin':
      case 'przypomnienie':
        return wiersz[kolumna].toDate().toISOString().substring(0, 10);
      case 'kwota':
        const formatter = new Intl.NumberFormat('pl-PL', {
          style: 'currency',
          currency: 'PLN',
        });
        return formatter.format(wiersz[kolumna]);
      default:
        return wiersz[kolumna];
    }
  }
}
