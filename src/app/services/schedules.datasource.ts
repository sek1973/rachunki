import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { TableDataSource } from '../components/tools/table/table-data-source';
import { ScheduleView } from '../model/schedule';
import { FirebaseService } from './firebase.service';

export class SchedulesDataSource extends TableDataSource<ScheduleView> {
  private schedulesSubject = new BehaviorSubject<ScheduleView[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService, private uid: string) {
    super();
  }

  connect(): BehaviorSubject<ScheduleView[]> {
    return this.schedulesSubject;
  }

  disconnect(): void {
    this.schedulesSubject.complete();
    this.loadingSubject.complete();
  }

  load() {
    this.loadingSubject.next(true);
    this.firebaseService
      .fetchSchedules(this.uid).pipe(
        map(schedules => this.firebaseService.formatSchedules(schedules))
      )
      .subscribe((schedules) => {
        this.schedulesSubject.next(schedules);
        this.loadingSubject.next(false);
        console.log('schedules data:', schedules);
      });
  }
}
