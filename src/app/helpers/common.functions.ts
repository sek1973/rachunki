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
  return val ? val.toDate().toLocaleDateString('pl-PL') : undefined;
}

export function timestampToDate(val: Timestamp): Date | undefined {
  return val ? val.toDate() : undefined;
}

export function currencyToString(val: number, NaNvalue: any = 0): string | undefined {
  const formatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  });
  if (val === undefined || val === null || Number.isNaN(+val)) {
    return formatter.format(NaNvalue);
  }
  return formatter.format(val);
}

export function currencyToNumber(val: string): number | undefined {
  if (val !== undefined && val !== null) {
    const cleaned = val.replace(/[^0-9\.,-]+/g, "").replace(',', '.');
    const result = Number(cleaned);
    return result;
  }
  return null;
}
