import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

export interface Schedule {
  uid: string;
  date: Timestamp;
  sum: number;
  remarks: string;
}

export interface ScheduleView {
  uid: string;
  date: string;
  sum: string;
  remarks: string;
}