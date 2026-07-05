import { getBookIncomeDailyTotals } from '@/lib/actions/folder/bookIncome.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface BookIncomeState {
    allData: any[];
    grandTotals: any;
    totalCount?: number;
    pageNumberBookIncome: number;
    pageLimitBookIncome: number;
    query: any;
    isBookIncomeLoading: boolean;


}

const initialState: BookIncomeState = {
  allData: [],
  grandTotals: [],
  totalCount: undefined,
  pageNumberBookIncome: 1,
  pageLimitBookIncome: 5,
  query: '',
  isBookIncomeLoading: false,
};


// thunks for api calls
export const filterBookIncome = createAsyncThunk(
  'bookIncome/filterBookIncome',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getBookIncomeDailyTotals({ query, page, limit });
    return {
      data: result.data,
      count: result.totalCount,
      grandTotals: result.grandTotals,

    };
  }
);





// Slice

const bookIncomeSlice = createSlice({
  name: 'bookIncome',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberBookIncome= action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitBookIncome = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterBookIncome.pending, (state) => {
          state.isBookIncomeLoading = true;
        })
        .addCase(filterBookIncome.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isBookIncomeLoading = false;
          state.grandTotals = action.payload.grandTotals;
        })
        .addCase(filterBookIncome.rejected, (state) => {
          state.isBookIncomeLoading = false;
          state.allData = []
          state.totalCount= 0
          state.grandTotals = []

        });       
  },
});

export const {
  setPageNumber,
  setPageLimit,
  setQuery,
} = bookIncomeSlice.actions;

export default bookIncomeSlice.reducer;