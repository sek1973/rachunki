import { FirebaseService } from './services/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

	constructor(private firebaseService: FirebaseService) {
		this.firebaseService.loadBills();
	}

	ngOnInit() { }
}
