import { firestore } from 'firebase';

import { Payment } from './payment';
import { Unit } from './unit';

import Timestamp = firestore.Timestamp;

export interface Bill {
	uid: string;
	id: number;
	lp: number;
	name: string;
	description: string;
	active: boolean;
	url: string;
	login: string;
	password: string;
	share: number;
	sum: number;
	deadline: Timestamp;
	remindOn: Timestamp;
	before: number;
	unit: Unit;
	payments: Payment[];
}
