import { FirebaseService } from './services/firebase.service';
import { RachunkiDataSource } from './services/rachunki.datasource';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
  title = 'rachunki';

  dataSource: RachunkiDataSource;
  displayedColumns = [ 'id', 'nazwa', 'opis' ];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.dataSource = new RachunkiDataSource(this.firebaseService);
    this.dataSource.wczytajRachunki();
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}
