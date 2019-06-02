import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { Rachunek } from '../model/rachunek';
import { FirebaseService } from './firebase.service';

export class LessonsDataSource implements DataSource<Rachunek> {
  private rachunkiSubject = new BehaviorSubject<Rachunek[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {}

  connect(collectionViewer: CollectionViewer): Observable<Rachunek[]> {
    return this.rachunkiSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.rachunkiSubject.complete();
    this.loadingSubject.complete();
  }

  wczytajRachunki(courseId: number, filter = '', sortDirection = 'asc', pageIndex = 0, pageSize = 3) {
    this.loadingSubject.next(true);

    this.firebaseService
      .odczytajRachunki()
      .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
      .subscribe((lessons) => this.rachunkiSubject.next(lessons));
  }
}
