import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Rachunek } from '../model/rachunek';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(public db: AngularFirestore) {}

  odczytajRachunki(): Observable<Rachunek[]> {
    return this.db.collection<Rachunek>('rachunki').valueChanges();
  }
}
