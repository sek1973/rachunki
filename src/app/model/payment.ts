import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

export interface Payment {
	uid: string;
	deadline: Timestamp;
	paiddate: Timestamp;
	sum: number;
	share: number;
	remarks: string;
}
