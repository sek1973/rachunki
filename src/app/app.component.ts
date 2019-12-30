import { Component, OnDestroy, OnInit } from '@angular/core';

import { AuthGuard } from './services/auth.guard';
import { AuthService } from './services/auth.service';
import { BillsFirebaseService } from './services/bills.firebase.service';
import { MessagingService } from './services/messaging.service';
import { ReminderService } from './services/reminder.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

	constructor(private billsFirebaseService: BillsFirebaseService,
		private messagingService: MessagingService,
		private authGuard: AuthGuard,
		private authService: AuthService,
		private reminderService: ReminderService) {
		this.reminderService.start();
	}

	ngOnInit() {
		this.authGuard.canActivate(null, null).subscribe(response => {
			if (response) {
				this.billsFirebaseService.load();
				this.authService.getUserName().subscribe(userId => {
					this.messagingService.requestPermission(userId);
					this.messagingService.receiveMessage();
				});
			}
		});
	}

	ngOnDestroy() {
		this.reminderService.stop();
	}

}
