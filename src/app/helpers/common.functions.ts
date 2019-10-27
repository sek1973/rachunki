export function getSafe(fn: () => any): any {
  try {
    return fn();
  } catch {
    return undefined;
  }
}
