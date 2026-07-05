import { groupedPaymentMethod } from '@/lib/actions/folder/groupedPayment.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface PaymentMethodsState {
    allData: any[];
    grandTotalAmount: any;
    totalCount?: number;
    pageNumberGroupedPayment: number;
    pageLimitGroupedPayment: number;
    query: any;
    isGroupedPaymentLoading: boolean;


}

const initialState: PaymentMethodsState = {
  allData: [],
  grandTotalAmount: undefined,
  totalCount: undefined,
  pageNumberGroupedPayment: 1,
  pageLimitGroupedPayment: 5,
  query: '',
  isGroupedPaymentLoading: false,
};


// thunks for api calls
export const filterGroupedPayments = createAsyncThunk(
  'GroupedPayments/filterGroupedPayments',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await groupedPaymentMethod({ query, page, limit });
    return {
      data: result.data,
      count: result.totalCount,
      grandTotalAmount: result.grandTotalAmount,

    };
  }
);





// Slice

const groupedPaymentsSlice = createSlice({
  name: 'groupedPayments',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberGroupedPayment= action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitGroupedPayment = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterGroupedPayments.pending, (state) => {
          state.isGroupedPaymentLoading = true;
        })
        .addCase(filterGroupedPayments.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isGroupedPaymentLoading = false;
          state.grandTotalAmount = action.payload.grandTotalAmount;
        })
        .addCase(filterGroupedPayments.rejected, (state) => {
          state.isGroupedPaymentLoading = false;
          state.allData = []
          state.totalCount= 0
          state.grandTotalAmount = 0

        });       
  },
});

export const {
  setPageNumber,
  setPageLimit,
  setQuery,
} = groupedPaymentsSlice.actions;

export default groupedPaymentsSlice.reducer;