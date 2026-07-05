'use client';

const DEFAULT_SYMBOL = 'Rs';

export function formatCurrency(
  amount: number,
  symbol: string = DEFAULT_SYMBOL,
  decimalPlaces: number = 2,
) {
  return `${symbol}${Number(amount || 0).toFixed(decimalPlaces)}`;
}

export const PAKISTAN_CURRENCY = DEFAULT_SYMBOL;
