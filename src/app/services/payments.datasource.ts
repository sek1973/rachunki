import { BehaviorSubject } from 'rxjs';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Payment } from '../model/payment';
import { PaymentsFirebaseService } from './payments.firebase.service';

export class PaymentsDataSource extends TableDataSource<Payment> {
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private paymentsFirebaseService: PaymentsFirebaseService, private uid: string) {
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
    this.paymentsFirebaseService
      .fetch(this.uid)
      .subscribe((payments) => {
        this.paymentsSubject.next(payments);
        this.loadingSubject.next(false);
      });
  }
}
