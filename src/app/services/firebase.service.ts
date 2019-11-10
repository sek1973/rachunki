import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Bill } from '../model/bill';
import { Payment } from '../model/payment';

import Timestamp = firestore.Timestamp;

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	private bills: Bill[];
	private billsSubject = new BehaviorSubject<Bill[]>([]);

	private billsLoadingSubject = new BehaviorSubject<boolean>(false);
	public billsLoading$ = this.billsLoadingSubject.asObservable();

	private billsSubscription = Subscription.EMPTY;

	constructor(public db: AngularFirestore) {
		this.loadBills();
	}

	loadBills() {
		this.billsSubscription.unsubscribe();
		this.billsSubscription = of({})
			.pipe(map(() => this.billsLoadingSubject.next(true)),
				mergeMap(() => this.fetchBills()),
				map(bills => {
					this.billsLoadingSubject.next(false);
					return bills;
				}),
				catchError(() => of([])))
			.subscribe((bills) => {
				this.bills = bills;
				this.billsSubject.next(bills);
			});
	}

	get billsObservable() {
		return this.billsSubject.asObservable();
	}

	fetchBills(): Observable<Bill[]> {
		return this.db.collection<Bill>('bills')
			.valueChanges({ idField: 'uid' });
	}

	fetchPayments(uid: string): Observable<Payment[]> {
		if (uid !== undefined) {
			const query = this.db.collection<Bill>('bills').doc(uid).collection<Payment>('payments');
			return query.valueChanges();
		}
		return of([]);
	}

	fetchPaymentsForBill(bill: Bill): Observable<Bill> {
		if (bill) {
			return this.fetchPayments(bill.uid).pipe(map(payments => {
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

	private createBillData(bill: Bill): any {
		if (bill.id === undefined) {
			if (this.bills && this.bills.length) {
				bill.id = Math.max(...this.bills.map(b => b.id)) + 1;
			} else { bill.id = 0; }
		}
		return {
			id: bill.id,
			name: bill.name || '',
			description: bill.description || '',
			active: bill.active || false,
			url: bill.url || '',
			login: bill.login || '',
			password: bill.password || '',
			share: bill.share || 1,
			sum: bill.sum || 0,
			deadline: bill.deadline || Timestamp.fromDate(new Date())
		};
	}

	addBill(bill: Bill): Promise<firestore.DocumentReference> {
		return this.db.collection('bills').add(this.createBillData(bill));
	}

	updateBill(bill: Bill) {
		this.db.collection('bills').doc(bill.uid).set(this.createBillData(bill))
			.then(() => console.log('Document successfully written!'))
			.catch((error) => console.error('Error writing document: ', error));
	}

	deleteBill(bill: Bill): Promise<void> {
		return this.db.collection('bills').doc(bill.uid).delete();
	}

	disconnect() {
		this.billsLoadingSubject.complete();
		this.billsSubscription.unsubscribe();
	}
}
