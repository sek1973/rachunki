import { Component, OnInit } from '@angular/core';

import { MessagingService } from './messaging.service';
import { BillsFirebaseService } from './services/bills.firebase.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

	constructor(private billsFirebaseService: BillsFirebaseService,
		private messagingService: MessagingService) {
		this.billsFirebaseService.load();
	}

	ngOnInit() {
		const userId = 'user001';
		this.messagingService.requestPermission(userId);
		this.messagingService.receiveMessage();
		console.log(this.messagingService.currentMessage);
	}
}
