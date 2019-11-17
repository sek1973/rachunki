import { firestore } from 'firebase';

import { Payment } from './payment';
import { Schedule } from './schedule';
import { Unit } from './unit';

import Timestamp = firestore.Timestamp;
import { FieldDescription } from './field-description';
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
	schedules: Schedule[];

	constructor() {
		this.name = 'Nowy rachunek';
		this.active = true;
		this.sum = 0;
		this.share = 1;
		this.deadline = Timestamp.fromDate(new Date());
	}
}

export const BillDescription = new Map<string, FieldDescription>([
	['name', {
		tooltipText: "Podaj nazwę rachunku do opłacania, np. Gaz.",
		placeholderText: "Nazwa rachunku do opłacania (np. gaz.)",
		labelText: 'Nazwa rachunku'
	}],
	['description', {
		tooltipText: "Dodaj opcjonalny opis rachunku.",
		placeholderText: "Opis / uwagi",
		labelText: 'Opis'
	}],
	['active', {
		tooltipText: "Odznacz, jeżeli rachunek (tymczasowo) nie ma być uwzględniany.",
		placeholderText: "Aktywny",
		labelText: 'Aktywny'
	}],
	['url', {
		tooltipText: "Podaj adres www dla rachunku np. 24.energa.pl (strona do logowania)",
		placeholderText: "Adres www rachunku - strona do logowania",
		labelText: 'Strona WWW'
	}],
	['deadline', {
		tooltipText: "Podaj termin dla najbliższej płatności",
		placeholderText: "Termin płatności",
		labelText: 'Termin płatności'
	}],
	['login', {
		tooltipText: "Podaj login, którego używasz na stronie logowania dystrybutora",
		placeholderText: "Login do konta u dystrybutora",
		labelText: 'Login'
	}],
	['password', {
		tooltipText: "Podaj hasło, którego używasz na stronie logowania dystrybutora",
		placeholderText: "Hasło do konta u dystrybutora",
		labelText: 'Hasło'
	}],
	['share', {
		tooltipText: "Jeżeli rachunek opłacasz wspólnie, podaj Twój udział",
		placeholderText: "Udział w opłacie",
		labelText: 'Udział'
	}],
	['sum', {
		tooltipText: "Podaj kwotę do zapłacenia",
		placeholderText: "Kwota do zapłacenia",
		labelText: 'Kwota'
	}]]);
