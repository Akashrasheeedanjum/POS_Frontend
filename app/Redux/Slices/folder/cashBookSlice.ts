import { getCashBook } from '@/lib/actions/folder/cashBook.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface CashBookState {
    allData: any[];
    grandTotalAmount: any;
    totalCount?: number;
    pageNumberCashBook: number;
    pageLimitCashBook: number;
    query: any;
    isCashBookLoading: boolean;


}

const initialState: CashBookState = {
  allData: [],
  grandTotalAmount: undefined,
  totalCount: undefined,
  pageNumberCashBook: 1,
  pageLimitCashBook: 5,
  query: '',
  isCashBookLoading: false,
};


// thunks for api calls
export const filterCashBook = createAsyncThunk(
  'cashBook/filterCashBook',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getCashBook({ query, page, limit });
    return {
      data: result.data,
      count: result.totalCount,
      grandTotalAmount: result.grandTotalCashAmount,

    };
  }
);





// Slice

const cashBookSlice = createSlice({
  name: 'cashBook',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberCashBook= action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitCashBook = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterCashBook.pending, (state) => {
          state.isCashBookLoading = true;
        })
        .addCase(filterCashBook.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isCashBookLoading = false;
          state.grandTotalAmount = action.payload.grandTotalAmount;
        })
        .addCase(filterCashBook.rejected, (state) => {
          state.isCashBookLoading = false;
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
} = cashBookSlice.actions;

export default cashBookSlice.reducer;