import { FirebaseService } from './../../services/firebase.service';
import { RachunkiDataSource } from './../../services/rachunki.datasource';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-zestawienie',
  templateUrl: './zestawienie.component.html',
  styleUrls: [ './zestawienie.component.scss' ],
})
export class ZestawienieComponent implements OnInit {
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
