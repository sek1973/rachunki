import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';

import { Bill } from '../model/bill';
import { FirebaseService } from './firebase.service';

export class BillsDataSource implements DataSource<Bill> {
	private billsSubject = new BehaviorSubject<Bill[]>([]);
	private loadingSubject = new BehaviorSubject<boolean>(false);

	public loading$ = this.loadingSubject.asObservable();

	constructor(private firebaseService: FirebaseService) { }

	connect(collectionViewer: CollectionViewer): Observable<Bill[]> {
		return this.billsSubject.asObservable();
	}

	disconnect(collectionViewer: CollectionViewer): void {
		this.billsSubject.complete();
		this.loadingSubject.complete();
	}

	loadBills(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
		this.loadingSubject.next(true);

		this.firebaseService
			.billsObservable
			.subscribe((bills) => {
				this.billsSubject.next(bills);
				this.loadingSubject.next(false);
			});

		this.firebaseService.loadBills();
	}
}
