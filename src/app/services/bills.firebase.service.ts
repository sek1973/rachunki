import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Bill } from '../model/bill';
import { Payment } from '../model/payment';
import { Schedule } from '../model/schedule';
import { Unit } from '../model/unit';
import { PaymentsFirebaseService } from './payments.firebase.service';
import { SchedulesFirebaseService } from './schedules.firebase.service';


import Timestamp = firestore.Timestamp;
@Injectable({
  providedIn: 'root',
})
export class BillsFirebaseService {
  private bills: Bill[];
  private billsSubject = new BehaviorSubject<Bill[]>([]);

  private billsLoadingSubject = new BehaviorSubject<boolean>(false);
  public billsLoading$ = this.billsLoadingSubject.asObservable();

  private billsSubscription = Subscription.EMPTY;

  constructor(public db: AngularFirestore,
    private paymentsService: PaymentsFirebaseService,
    private schedulesService: SchedulesFirebaseService) {
    this.load();
  }

  load() {
    this.billsSubscription.unsubscribe();
    this.billsSubscription = of({})
      .pipe(map(() => this.billsLoadingSubject.next(true)),
        mergeMap(() => this.fetch()),
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

  private fetch(): Observable<Bill[]> {
    return this.db.collection<Bill>('bills')
      .valueChanges({ idField: 'uid' });
  }

  fetchItem(id: number): Observable<Bill> {
    if (id !== undefined) {
      const query = this.db.doc<Bill>('bills/' + id);
      return query.valueChanges();
    }
    return of(null);
  }

  private createBillData(bill: Bill): Bill {
    if (bill.id === undefined) {
      if (this.bills && this.bills.length) {
        bill.id = Math.max(...this.bills.map(b => b.id)) + 1;
      } else { bill.id = 0; }
    }
    const result: Bill = {
      lp: bill.lp || bill.id,
      id: bill.id,
      name: bill.name || '',
      description: bill.description || '',
      active: bill.active || false,
      sum: bill.sum || 0,
      share: bill.share || 1,
      deadline: bill.deadline || Timestamp.fromDate(new Date()),
      reminder: bill.reminder || Timestamp.fromDate(new Date()),
      repeat: bill.repeat || 1,
      unit: bill.unit || Unit.Month,
      url: bill.url || '',
      login: bill.login || '',
      password: bill.password || ''
    };
    if (bill.uid) { result.uid = bill.uid; }
    return result;
  }

  add(bill: Bill): Promise<firestore.DocumentReference> {
    return this.db.collection('bills').add(this.createBillData(bill));
  }

  update(bill: Bill): Promise<void> {
    return this.db.collection('bills').doc(bill.uid).set(bill);
  }

  private updateInTransaction(bill: Bill, transaction: firestore.Transaction): firestore.Transaction {
    const ref = this.db.firestore.collection('bills').doc(bill.uid)
    return transaction.update(ref, bill);
  }

  delete(bill: Bill): Promise<void> {
    return this.db.collection('bills').doc(bill.uid).delete();
  }

  disconnect() {
    this.billsLoadingSubject.complete();
    this.billsSubscription.unsubscribe();
  }

  calculateNextDeadline(bill: Bill): firestore.Timestamp {
    const deadline = bill.deadline.toDate();
    switch (bill.unit) {
      case Unit.Day:
        deadline.setDate(deadline.getDate() + bill.repeat);
        break;
      case Unit.Month:
        deadline.setMonth(deadline.getMonth() + bill.repeat);
        break;
      case Unit.Week:
        deadline.setDate(deadline.getDate() + (bill.repeat * 7));
        break;
      case Unit.Year:
        deadline.setFullYear(deadline.getFullYear() + bill.repeat);
        break;
      default:
        break;
    }
    return Timestamp.fromDate(deadline);
  }

  pay(bill: Bill) {
    const billUid = bill.uid;
    const payment = this.createPaymentData(bill);
    const billCopy = this.createBillData(bill);
    let schedule: Schedule;
    return this.db.firestore.runTransaction(transaction => {
      return this.schedulesService.fetchComming(bill).then(sch => {
        schedule = sch;
        this.paymentsService.addInTransaction(payment, billUid, transaction);
        this.adjustBillData(billCopy, schedule);
        if (schedule) { this.schedulesService.deleteInTransaction(schedule, billUid, transaction); }
        this.updateInTransaction(billCopy, transaction);
      });
    });
  }

  private createPaymentData(bill: Bill): Payment {
    return this.paymentsService.createPaymentData({
      deadline: bill.deadline,
      paiddate: Timestamp.fromDate(new Date()),
      sum: bill.sum, // input box if there is no value
      share: bill.sum * bill.share,
      remarks: undefined
    })
  }

  private adjustBillData(billCopy: Bill, schedule: Schedule): Bill {
    const deadline = schedule ? schedule.date : this.calculateNextDeadline(billCopy);
    const sum = schedule ? schedule.sum : billCopy.sum; // consider remarks
    billCopy.deadline = deadline;
    billCopy.sum = sum;
    return billCopy;
  }

}
