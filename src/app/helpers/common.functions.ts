import { firestore } from 'firebase';

import Timestamp = firestore.Timestamp;
import { PercentPipe } from '@angular/common';

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
    const cleaned = val.replace(/[^0-9\.,-]+/g, '').replace(',', '.');
    const result = Number(cleaned);
    return result;
  }
  return null;
}

export function percentToString(val: number, NaNvalue: any = 0): string | undefined {
  if (val === undefined || val === null || Number.isNaN(+val)) {
    return Math.round(NaNvalue * 100) + ' %';
  }
  return Math.round(val * 100) + ' %';
}

export function percentToNumber(val: string): number | undefined {
  if (val !== undefined && val !== null) {
    const cleaned = val.replace(/[^0-9\.,-]+/g, '').replace(',', '.');
    const result = Number(cleaned) / 100;
    return result;
  }
  return null;
}
