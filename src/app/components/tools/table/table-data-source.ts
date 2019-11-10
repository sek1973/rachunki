import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';

export abstract class TableDataSource<T> extends MatTableDataSource<T> {
  loading$: Observable<boolean>;
}