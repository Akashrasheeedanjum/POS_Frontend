import { apiGet, apiPost } from '../api';

export interface ProductionRecord {
  _id: string;
  productionNo: string;
  scrapPurchase: ScrapPurchaseRef;
  quantityUsed: number;
  outputDesignation: string;
  outputArticle?: { _id: string; designation: string; productId: string };
  outputQuantity: number;
  productionCost: number;
  unitCost: number;
  status: string;
  remarks?: string;
  productionDate: string;
}

export interface ScrapPurchaseRef {
  _id: string;
  purchaseNo: string;
  materialType: string;
  remainingQuantity: number;
  unit: string;
}

export interface CreateProductionPayload {
  scrapPurchaseId: string;
  quantityUsed: number;
  outputDesignation: string;
  outputQuantity: number;
  outputArticleId?: string;
  markupPercent?: number;
  remarks?: string;
}

export const createProduction = async (
  data: CreateProductionPayload,
  token?: string,
) => apiPost('/production/create', data, token);

export const getProductions = async (token?: string) => {
  const result = await apiGet<ProductionRecord[] | ProductionRecord>('/production/all', token);
  return Array.isArray(result) ? result : result ? [result] : [];
};
