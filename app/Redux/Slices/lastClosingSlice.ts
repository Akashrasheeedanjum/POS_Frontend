import { getLastClosingReport, singleZReport } from '@/lib/actions/lastClosing.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';



interface LastClosingState {
    data: any[];
    singleZReportData: any[];
    isSingleZReportLoading: boolean;
    query: any;
    isLastClosingLoading: boolean;
    selectedRowDataForRedux:any

}

const initialState: LastClosingState = {
  data: [],
  isLastClosingLoading: false,
  singleZReportData: [],
  isSingleZReportLoading: false,
  query: '',
  selectedRowDataForRedux:null
};


// thunks for api calls
export const filterLastClosing = createAsyncThunk(
  'lastClosing/filterLastClosing',
  async ({ query, token}: { query?: any, token?:any}, thunkAPI) => {

    try {
    const state = thunkAPI.getState() as RootState;
    const reduxToken = state.customer.token; 
    const result = await getLastClosingReport({ query}, token?token:reduxToken);
    return {
      data: result
    };
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchSingleZReport = createAsyncThunk(
  'lastClosing/fetchSingleZReport',
  async (id:any) => {
    console.log('...........id1', id)
    const result = await singleZReport(id);
    return {
      data: result
    };
  }
);





// Slice

const lastClosingSlice = createSlice({
  name: 'lastClosing',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
    selectRowDataForRedux: (state, action: PayloadAction<{data: any|null }>) => {
      state.selectedRowDataForRedux = action.payload.data;
    },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterLastClosing.pending, (state) => {
          state.isLastClosingLoading = true;
        })
        .addCase(filterLastClosing.fulfilled, (state, action) => {
          state.data = action.payload.data;
          state.isLastClosingLoading = false;
        })
        .addCase(filterLastClosing.rejected, (state) => {
          state.isLastClosingLoading = false;
          state.singleZReportData = []
        })   

        .addCase(fetchSingleZReport.pending, (state) => {
          state.isSingleZReportLoading = true;
        })
        .addCase(fetchSingleZReport.fulfilled, (state, action) => {
          state.singleZReportData = action.payload.data;
          state.isSingleZReportLoading = false;
        })
        .addCase(fetchSingleZReport.rejected, (state) => {
          state.isSingleZReportLoading = false;
          state.singleZReportData = []
        });       
  },
});

export const {
  setQuery,
  selectRowDataForRedux
} = lastClosingSlice.actions;

export default lastClosingSlice.reducer;