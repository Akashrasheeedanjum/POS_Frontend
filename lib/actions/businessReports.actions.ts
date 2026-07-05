import { apiGet } from '../api';

export const getSalesSummary = async (
  params: { period?: string; date?: string },
  token?: string,
) => {
  const query = new URLSearchParams();
  if (params.period) query.set('period', params.period);
  if (params.date) query.set('date', params.date);
  return apiGet(`/business-reports/sales-summary?${query.toString()}`, token);
};

export const getPurchaseSummary = async (
  params: { period?: string; date?: string },
  token?: string,
) => {
  const query = new URLSearchParams();
  if (params.period) query.set('period', params.period);
  if (params.date) query.set('date', params.date);
  return apiGet(`/business-reports/purchase-summary?${query.toString()}`, token);
};

export const getDailyPnl = async (
  params: { period?: string; date?: string },
  token?: string,
) => {
  const query = new URLSearchParams();
  if (params.period) query.set('period', params.period);
  if (params.date) query.set('date', params.date);
  return apiGet(`/business-reports/daily-pnl?${query.toString()}`, token);
};

export const getPurchaseJournal = async (
  params: { period?: string; date?: string; page?: number; limit?: number },
  token?: string,
) => {
  const query = new URLSearchParams();
  if (params.period) query.set('period', params.period);
  if (params.date) query.set('date', params.date);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  return apiGet(`/business-reports/purchase-journal?${query.toString()}`, token);
};
