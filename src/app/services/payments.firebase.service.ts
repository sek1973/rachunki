import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Bill } from '../model/bill';
import { Payment } from '../model/payment';

import Timestamp = firestore.Timestamp;

@Injectable({
  providedIn: 'root',
})
export class PaymentsFirebaseService {

  constructor(public db: AngularFirestore) { }

  fetchForBill(bill: Bill): Observable<Bill> {
    if (bill) {
      return this.fetch(bill.uid).pipe(map(payments => {
        bill.payments = payments;
        return bill;
      }));
    }
    return of(null);
  }

  fetch(uid: string): Observable<Payment[]> {
    if (uid !== undefined) {
      const query = this.db.collection<Bill>('bills').doc(uid).collection<Payment>('payments');
      return query.valueChanges({ idField: 'uid' });
    }
    return of([]);
  }

  private createPaymentData(payment: Payment): any {
    return {
      deadline: payment.deadline || Timestamp.fromDate(new Date()),
      paiddate: payment.paiddate || undefined,
      sum: payment.sum,
      share: payment.share,
      remarks: payment.remarks || ''
    };
  }

  add(payment: Payment, billUid: string): Promise<firestore.DocumentReference> {
    return this.db.collection('bills').doc(billUid).collection('payments').add(this.createPaymentData(payment));
  }

  update(payment: Payment, billUid: string): Promise<void> {
    return this.db.collection('bills').doc(billUid).collection('payments').doc(payment.uid).set(this.createPaymentData(payment));
  }

  delete(payment: Payment, billUid: string): Promise<void> {
    return this.db.collection('bills').doc(billUid).collection('payments').doc(payment.uid).delete();
  }

}
