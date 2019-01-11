import { Jednostka } from './jednostka';
import { Platnosc } from './platnosc';

export interface Rachunek {
	id: number;
	lp: number;
	nazwa: string;
	opis: string;
	aktywny: boolean;
	url: string;
	login: string;
	haslo: string;
	udzial: number;
	kwota: number;
	przypomnienie: Date;
	ilePrzed: number;
	jednostka: Jednostka;
	platnosci: Platnosc[];
}
