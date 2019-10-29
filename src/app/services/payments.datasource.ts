import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable } from 'rxjs';

import { Payment } from '../model/payment';
import { FirebaseService } from './firebase.service';

export class PaymentsDataSource implements DataSource<Payment> {
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService, private uid: string) { }

  connect(collectionViewer: CollectionViewer): Observable<Payment[]> {
    return this.paymentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.paymentsSubject.complete();
    this.loadingSubject.complete();
  }

  loadBills(filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.loadingSubject.next(true);

    this.firebaseService
      .fetchPayments(this.uid)
      .subscribe((payments) => {
        this.paymentsSubject.next(payments);
        this.loadingSubject.next(false);
      });
  }
}
