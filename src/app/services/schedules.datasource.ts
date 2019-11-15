import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { Schedule } from '../model/schedule';
import { FirebaseService } from './firebase.service';

export class SchedulesDataSource extends TableDataSource<Schedule> {
  private schedulesSubject = new BehaviorSubject<Schedule[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService, private uid: string) {
    super();
  }

  connect(): BehaviorSubject<Schedule[]> {
    return this.schedulesSubject;
  }

  disconnect(): void {
    this.schedulesSubject.complete();
    this.loadingSubject.complete();
  }

  load() {
    this.loadingSubject.next(true);
    this.firebaseService
      .fetchSchedules(this.uid)
      .subscribe((schedules) => {
        this.schedulesSubject.next(schedules);
        this.loadingSubject.next(false);
        console.log('schedules data:', schedules);
      });
  }
}
