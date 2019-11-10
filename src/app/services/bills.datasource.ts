import { CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Bill } from '../model/bill';
import { FirebaseService } from './firebase.service';

export class BillsDataSource extends TableDataSource<Bill> {
	private billsSubject = new BehaviorSubject<Bill[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private firebaseService: FirebaseService) {
		super([]);
	}

	connect() {
		return this.billsSubject;
	}

	disconnect(): void {
		this.billsSubject.complete();
		this.loadingSubject.complete();
	}

	loadBills(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
		this.loadingSubject.next(true);

		this.firebaseService
			.billsObservable
			.subscribe((bills) => {
				this.data = bills;
				this.billsSubject.next(bills);
				this.loadingSubject.next(false);
			});

		this.firebaseService.loadBills();
	}
}
