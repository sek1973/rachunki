import { Jednostka } from './jednostka';
import { Platnosc } from './platnosc';
import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

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
  termin: Timestamp;
  przypomnienie: Timestamp;
  ilePrzed: number;
  jednostka: Jednostka;
  platnosci: Platnosc[];
}
