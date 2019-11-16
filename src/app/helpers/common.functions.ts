import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;

export function getSafe(fn: () => any): any {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function timestampToString(val: Timestamp): string | undefined {
  return val ? val.toDate().toISOString().substring(0, 10) : undefined;
}

export function timestampToDate(val: Timestamp): Date | undefined {
  return val ? val.toDate() : undefined;
}

export function currencyToString(val: number): string | undefined {
  if (val !== undefined && val !== null) {
    const formatter = new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
    });
    return formatter.format(val);
  }
  return undefined;
}
