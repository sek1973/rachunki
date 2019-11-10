import { BehaviorSubject, Observable } from 'rxjs';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Bill } from '../model/bill';
import { FirebaseService } from './firebase.service';

export class BillsDataSource extends TableDataSource<Bill> {
	private billsSubject = new BehaviorSubject<Bill[]>([]);

	public loading$: Observable<boolean>;

	constructor(private firebaseService: FirebaseService) {
		super([]);
		this.loading$ = this.firebaseService.billsLoading$;
		this.firebaseService
			.billsObservable
			.subscribe((bills) => {
				this.data = bills;
				this.billsSubject.next(bills);
			});
	}

	connect() {
		return this.billsSubject;
	}

	disconnect(): void {
		this.billsSubject.complete();
	}

}
