import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Rachunek } from '../model/rachunek';

@Injectable({
	providedIn: 'root',
})
export class FirebaseService {
	constructor(public db: AngularFirestore) {}

	odczytajRachunki() {
		return this.db.collection('rachunki').valueChanges();
	}
}
