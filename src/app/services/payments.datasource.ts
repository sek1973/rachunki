import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Payment } from '../model/payment';
import { FirebaseService } from './firebase.service';

export class PaymentsDataSource extends TableDataSource<Payment> {
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService, private uid: string) {
    super();
  }

  connect(): BehaviorSubject<Payment[]> {
    return this.paymentsSubject;
  }

  disconnect(): void {
    this.paymentsSubject.complete();
    this.loadingSubject.complete();
  }

  load() {
    this.loadingSubject.next(true);
    this.firebaseService
      .fetchPayments(this.uid)
      .subscribe((payments) => {
        this.paymentsSubject.next(payments);
        this.loadingSubject.next(false);
        console.log('payments data:', payments);
      });
  }
}
