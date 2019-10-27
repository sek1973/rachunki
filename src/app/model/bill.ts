import { firestore } from 'firebase';

import { Payment } from './payment';
import { Unit } from './unit';

import Timestamp = firestore.Timestamp;

export class Bill {
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

	constructor() {
		this.name = 'Nowy rachunek';
		this.active = true;
		this.sum = 0;
		this.share = 1;
		this.deadline = Timestamp.fromDate(new Date());
	}
}
