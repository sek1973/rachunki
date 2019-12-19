import { BehaviorSubject, Observable } from 'rxjs';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Bill } from '../model/bill';
import { BillsFirebaseService } from './bills.firebase.service';

export class BillsDataSource extends TableDataSource<Bill> {
	private billsSubject = new BehaviorSubject<Bill[]>([]);

	public loading$: Observable<boolean>;

	constructor(private billsFirebaseService: BillsFirebaseService) {
		super([]);
		this.loading$ = this.billsFirebaseService.billsLoading$;
		this.billsFirebaseService
			.billsObservable
			.subscribe((bills) => {
				this.data = bills.sort((a, b) => {
					if (!a.active && b.active) { return 1; }
					if (a.active && !b.active) { return -1; }
					if (a.deadline.toDate() > b.deadline.toDate()) { return 1; }
					if (a.deadline.toDate() < b.deadline.toDate()) { return -1; }
					if (a.name > b.name) { return 1; }
					if (a.name < b.name) { return -1; }
				});
				this.billsSubject.next(this.data);
			});
	}

	connect() {
		return this.billsSubject;
	}

	disconnect(): void {
		this.billsSubject.complete();
	}

}
