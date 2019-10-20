import { Jednostka } from './jednostka';
import { Platnosc } from './platnosc';
import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

export interface Bill {
  id: number;
  lp: number;
  name: string;
  description: string;
  active: boolean;
  url: string;
  login: string;
  password: string;
  udzial: number;
  sum: number;
  termin: Timestamp;
  przypomnienie: Timestamp;
  ilePrzed: number;
  jednostka: Jednostka;
  platnosci: Platnosc[];
}
