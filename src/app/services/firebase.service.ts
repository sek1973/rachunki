import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';

import { Bill } from '../model/bill';
import { Payment } from '../model/payment';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	constructor(public db: AngularFirestore) { }

	fetchBills(): Observable<Bill[]> {
		return this.db.collection<Bill>('bills').valueChanges();
	}

	fetchPayments(id: number): Observable<Payment[]> {
		if (id !== undefined) {
			const query = this.db.collection<Payment>('payments', ref => ref.where('id', '==', id));
			return query.valueChanges();
		}
		return of([]);
	}
}
