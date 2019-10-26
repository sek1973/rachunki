import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import { Bill } from '../model/bill';
import { Payment } from '../model/payment';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	constructor(public db: AngularFirestore) { }

	fetchBills(): Observable<Bill[]> {
		return this.db.collection<Bill>('bills')
			.valueChanges({ idField: 'uid' });
	}

	fetchPayments(id: number): Observable<Payment[]> {
		if (id !== undefined) {
			const query = this.db.collection<Payment>('payments', ref => ref.where('id', '==', id));
			return query.valueChanges();
		}
		return of([]);
	}

	fetchPaymentsForBill(bill: Bill): Observable<Bill> {
		if (bill) {
			return this.fetchPayments(bill.id).pipe(map(payments => {
				bill.payments = payments;
				return bill;
			}));
		}
		return of(null);
	}

	fetchBill(id: number): Observable<Bill> {
		if (id !== undefined) {
			const query = this.db.doc<Bill>('bills/' + id);
			return query.valueChanges()
				.pipe(mergeMap(bill => this.fetchPaymentsForBill(bill)));
		}
		return of(null);
	}
}
