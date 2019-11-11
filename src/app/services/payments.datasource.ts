import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { PaymentView } from '../model/payment';
import { FirebaseService } from './firebase.service';

export class PaymentsDataSource extends TableDataSource<PaymentView> {
  private paymentsSubject = new BehaviorSubject<PaymentView[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService, private uid: string) {
    super();
  }

  connect(): BehaviorSubject<PaymentView[]> {
    return this.paymentsSubject;
  }

  disconnect(): void {
    this.paymentsSubject.complete();
    this.loadingSubject.complete();
  }

  load() {
    this.loadingSubject.next(true);
    this.firebaseService
      .fetchPayments(this.uid).pipe(
        map(payments => this.firebaseService.formatPayments(payments))
      )
      .subscribe((payments) => {
        this.paymentsSubject.next(payments);
        this.loadingSubject.next(false);
        console.log('payments data:', payments);
      });
  }
}
