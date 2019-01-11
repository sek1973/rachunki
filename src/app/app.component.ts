import { FirebaseService } from './services/firebase.service';
import { LessonsDataSource } from './services/rachunki.datasource';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ],
})
export class AppComponent implements OnInit {
	title = 'rachunki';

	dataSource: LessonsDataSource;
	displayedColumns = [ 'seqNo', 'description', 'duration' ];

	constructor(private firebaseService: FirebaseService) {}

	ngOnInit() {
		this.dataSource = new LessonsDataSource(this.firebaseService);
	}

	onRowClicked(row) {
		console.log('Row clicked: ', row);
	}
}
