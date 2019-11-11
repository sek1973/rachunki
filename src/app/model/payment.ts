import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

export interface Payment {
	uid: string;
	deadline: Timestamp;
	paidDate: Timestamp;
	sum: number;
	remarks: string;
}

export interface PaymentView {
	uid: string;
	deadline: string;
	paidDate: string;
	sum: string;
	remarks: string;
}
