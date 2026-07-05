import { fetchAllZReports } from '@/lib/actions/folder/ticketDeCloture.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface TicketDeClotureState {
    allData: any[];
    totalCount?: number;
    pageNumberTicketDeCloture: number;
    pageLimitTicketDeCloture: number;
    query: any;
    isTicketDeClotureLoading: boolean;

}

const initialState: TicketDeClotureState = {
  allData: [],
  totalCount: undefined,
  pageNumberTicketDeCloture: 1,
  pageLimitTicketDeCloture: 5,
  query: '',
  isTicketDeClotureLoading: false,
};


// thunks for api calls
export const filterTicketDeCloture = createAsyncThunk(
  'ticketDeCloture/filterTicketDeCloture',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await fetchAllZReports({ query, page, limit });
    return {
      data: result.allZReports,
      count: result.count,
    };
  }
);

// Slice

const ticketDeClotureSlice = createSlice({
  name: 'ticketDeCloture',
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberTicketDeCloture= action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitTicketDeCloture= action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterTicketDeCloture.pending, (state) => {
          state.isTicketDeClotureLoading = true;
        })
        .addCase(filterTicketDeCloture.fulfilled, (state, action) => {
          state.allData = action.payload.data;
          state.totalCount = action.payload.count
          state.isTicketDeClotureLoading = false;
        })
        .addCase(filterTicketDeCloture.rejected, (state) => {
          state.isTicketDeClotureLoading = false;
          state.allData = []
          state.totalCount= 0
        });       
  },
});

export const {
  setPageNumber,
  setPageLimit,
  setQuery,
} = ticketDeClotureSlice.actions;

export default ticketDeClotureSlice.reducer;