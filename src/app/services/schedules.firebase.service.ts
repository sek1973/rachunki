import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Bill } from '../model/bill';
import { Schedule } from '../model/schedule';

import Timestamp = firestore.Timestamp;
@Injectable({
  providedIn: 'root',
})
export class SchedulesFirebaseService {

  constructor(public db: AngularFirestore) { }

  fetchForBill(bill: Bill): Observable<Bill> {
    if (bill) {
      return this.fetch(bill.uid).pipe(map(schedules => {
        bill.schedules = schedules;
        return bill;
      }));
    }
    return of(null);
  }

  fetch(uid: string): Observable<Schedule[]> {
    if (uid !== undefined) {
      const query = this.db.collection<Bill>('bills').doc(uid).collection<Schedule>('schedules');
      return query.valueChanges();
    }
    return of([]);
  }

}
