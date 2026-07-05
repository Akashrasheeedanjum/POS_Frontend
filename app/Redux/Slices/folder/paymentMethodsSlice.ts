import { paymentMethodsByPeriod } from '@/lib/actions/folder/paymentMethods.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface PaymentMethodsState {
    allData: any[];
    grandTotalAmount: any;
    totalCount?: number;
    pageNumberPaymentMethods: number;
    pageLimitPaymentMethods: number;
    query: any;
    isPaymentMethodsLoading: boolean;


}

const initialState: PaymentMethodsState = {
  allData: [],
  grandTotalAmount: undefined,
  totalCount: undefined,
  pageNumberPaymentMethods: 1,
  pageLimitPaymentMethods: 5,
  query: '',
  isPaymentMethodsLoading: false,
};


// thunks for api calls
export const filterPaymentMethods = createAsyncThunk(
  'PaymentMethods/filterPaymentMethods',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await paymentMethodsByPeriod({ query, page, limit });
    return {
      data: result.data,
      count: result.totalCount,
      grandTotalAmount: result.grandTotalAmount,

    };
  }
);





// Slice

const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberPaymentMethods= action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitPaymentMethods = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterPaymentMethods.pending, (state) => {
          state.isPaymentMethodsLoading = true;
        })
        .addCase(filterPaymentMethods.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isPaymentMethodsLoading = false;
          state.grandTotalAmount = action.payload.grandTotalAmount;
        })
        .addCase(filterPaymentMethods.rejected, (state) => {
          state.isPaymentMethodsLoading = false;
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
} = paymentMethodsSlice.actions;

export default paymentMethodsSlice.reducer;