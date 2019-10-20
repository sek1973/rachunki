import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Bill } from '../model/bill';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	constructor(public db: AngularFirestore) { }

	fetchBills(): Observable<Bill[]> {
		return this.db.collection<Bill>('bills').valueChanges();
	}
}
