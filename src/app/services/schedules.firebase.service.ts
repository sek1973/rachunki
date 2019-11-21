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

  fetchComming(bill: Bill): Promise<Schedule> {
    const billUid = bill.uid;
    const ref = this.db.collection<Bill>('bills').doc(billUid).collection<Schedule>('schedules').ref;
    return ref.orderBy('date').limit(1).get().then(result => {
      if (result.empty === false) {
        return result[0];
      } else { return null; }
    });
  }

  fetch(billUid: string): Observable<Schedule[]> {
    if (billUid !== undefined) {
      const query = this.db.collection<Bill>('bills').doc(billUid).collection<Schedule>('schedules');
      return query.valueChanges({ idField: 'uid' });
    }
    return of([]);
  }

  queryByDate(billUid: string, date: Timestamp): Promise<firestore.QuerySnapshot> {
    const ref = this.db.collection<Bill>('bills').doc(billUid).collection<Schedule>('schedules').ref;
    return ref.where('date', '==', date).get();
  }

  private createScheduleData(schedule: Schedule): Schedule {
    return {
      uid: schedule.uid,
      date: schedule.date || Timestamp.fromDate(new Date()),
      sum: schedule.sum || 0,
      remarks: schedule.remarks || '',
    };
  }

  add(schedule: Schedule, billUid: string): Promise<firestore.DocumentReference> {
    return this.db.collection('bills').doc(billUid).collection('schedules').add(this.createScheduleData(schedule));
  }

  update(schedule: Schedule, billUid: string): Promise<void> {
    return this.db.collection('bills').doc(billUid).collection('schedules').doc(schedule.uid).set(this.createScheduleData(schedule));
  }

  delete(schedule: Schedule, billUid: string): Promise<void> {
    return this.db.collection('bills').doc(billUid).collection('schedules').doc(schedule.uid).delete();
  }

  deleteInTransaction(schedule: Schedule, billUid: string, transaction: firestore.Transaction): firestore.Transaction {
    const ref = this.db.firestore.collection('bills').doc(billUid).collection('schedules').doc(schedule.uid);
    return transaction.delete(ref);
  }

}
