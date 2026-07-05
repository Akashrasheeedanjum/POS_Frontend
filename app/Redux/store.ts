// store.ts
import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './Slices/customerSlice';
import supplierReducer from './Slices/supplierSlice';
import articleReducer from './Slices/articlesSlice'; 
import documentReducer from './Slices/folder/documentSlice'; 
import receiptReducer from './Slices/folder/receiptSlice'; 
import salesReducer from './Slices/salesSlice'; 
import newDocumentReducer from './Slices/newDocuments/documentSlice';
import salesanalisisReducer from './Slices/folder/salesanalisisSlice'; 
import bestSellersReducer from './Slices/folder/bestSellersSlice'; 
import bookIncomeReducer from './Slices/folder/bookIncomeSlice'; 
import paymentMethodsReducer from './Slices/folder/paymentMethodsSlice'; 
import groupedPaymentReducer from './Slices/folder/groupedPaymentSlice'; 
import salesJournalReducer from './Slices/folder/salesJournalSlice'; 
import cashBookReducer from './Slices/folder/cashBookSlice'; 
import lastClosingReducer from './Slices/lastClosingSlice'; 
import ticketDeClotureReducer from './Slices/folder/ticketDeCloture'; 
import stocksReducer from './Slices/stockSlice'; 

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    supplier: supplierReducer,
    article:articleReducer,
    stocks:stocksReducer,
    document: documentReducer,
    receipt: receiptReducer,
    sales: salesReducer,
    salesanalisis: salesanalisisReducer, 
    bestSellers: bestSellersReducer, 
    bookIncome: bookIncomeReducer, 
    paymentMethods: paymentMethodsReducer, 
    groupedPayment: groupedPaymentReducer, 
    salesJournal: salesJournalReducer, 
    cashBook: cashBookReducer, 
    newdocument: newDocumentReducer, 
    lastClosing: lastClosingReducer, 
    ticketDeCloture: ticketDeClotureReducer, 
  },
});

// Types for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
