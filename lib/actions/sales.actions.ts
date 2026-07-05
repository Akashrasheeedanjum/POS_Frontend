import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../api";

export enum VatCodeEnum {
  VAT1 = 'VAT1',
  VAT2 = 'VAT2',
  VAT3 = 'VAT3',
  VAT4 = 'VAT4',
}

export interface SingleArticleData{
  articleId: string;
  article_productId: string;
  nameAtPurchase: string;
  quantityAtPurchase: number;
  discountType?: string;
  discountPercentage?: number;
  discountAmount?: number;
  singleUnitPrice_vatExclude: number;
  rateOfVat_atPurchase: number;
  codeOfVat_atPurchase: VatCodeEnum;
}

export interface PaymentMethods {
  paymentMethod_id: string;
  paymentMethod_name: string;
}

export interface DiscountDetails{
  discountOnWhole_category?:string;
  discountPercentage?: number;
  discountedAmount?: number;
}


export interface TicketData{
register?: number;
receiptType: string;
status?: string;
articles: SingleArticleData[];
paymentMethods: PaymentMethods[]; 
discountDetails?: DiscountDetails[];
customer: string;
perceivedAmount: number;
dueDate?: string;
}

export const getLatestVatVersion = async(token?: string) => {
    return apiGet('/vatRate-version/latestVatVersion', token);
};


export const createTicket = async (ticketData: TicketData, token?: string) => {
  return apiPost('/sales-management/createTicket', ticketData, token);
};
 
export const updateTicket = async (
  ticketId: string,
  ticketData: Partial<TicketData>,
  token?: string
) => {
  return apiPatch(
    `/sales-management/editTicket/${ticketId}`,
    ticketData,
    token
  );
};


export const articlesForSales = async ({
  search = ''
}: {
  search?: string;
},
token?: string) => {
  const params = new URLSearchParams();
  
  // Append parsed query string params to the main params
  if (search) {
    const queryParams = new URLSearchParams(search);
        queryParams.forEach((value, key) => {
          params.set(key, value);
        });
      }
      
      return apiGet(`/articles/allArticles?${params.toString()}`, token);
};


export const getWaitingTickets = async(token?: string) => {
    return apiGet('/sales-management/waitingTickets', token);
};


export const createWaitingTicket = async (waitingTicket: any, token?: string) => {
  return apiPost('/sales-management/createWaitingTicket', waitingTicket, token);
};


export const deleteWaitingTicket = async (id: string|undefined, token?: string) => {
  return apiDelete(`/sales-management/deleteWaitingTicket/${id}`, token);
};