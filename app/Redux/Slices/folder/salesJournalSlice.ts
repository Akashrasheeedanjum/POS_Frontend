import { getSalesJournal } from '@/lib/actions/folder/salesJournal.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface SalesJournalState {
    allData: any[];
    grandTotals: any;
    totalCount?: number;
    pageNumberSalesJournal: number;
    pageLimitSalesJournal: number;
    query: any;
    isSalesJournalLoading: boolean;


}

const initialState: SalesJournalState = {
  allData: [],
  grandTotals: [],
  totalCount: undefined,
  pageNumberSalesJournal: 1,
  pageLimitSalesJournal: 5,
  query: '',
  isSalesJournalLoading: false,
};


// thunks for api calls
export const filterSalesJournal = createAsyncThunk(
  'salesJournal/filterSalesJournal',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getSalesJournal({ query, page, limit });
    return {
      data: result.data,
      count: result.totalCount,
      grandTotals: result.grandTotals,

    };
  }
);





// Slice

const salesJournalSlice = createSlice({
  name: 'salesJournal',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberSalesJournal = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitSalesJournal = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterSalesJournal.pending, (state) => {
          state.isSalesJournalLoading = true;
        })
        .addCase(filterSalesJournal.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isSalesJournalLoading = false;
          state.grandTotals = action.payload.grandTotals;
        })
        .addCase(filterSalesJournal.rejected, (state) => {
          state.isSalesJournalLoading = false;
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
} = salesJournalSlice.actions;

export default salesJournalSlice.reducer;