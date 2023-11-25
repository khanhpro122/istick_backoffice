// Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

// Types
import { ListResearch } from '@/types/research';
// Apis
import { IGetListResearchParam, IGetListResearchRes, fetchResearchs } from '@/apis/researchs';

export interface ResearchsState {
  researchs: {
    loading: boolean;
    list: ListResearch | undefined;
  };
}

const initialState: ResearchsState = {
  researchs: {
    loading: false,
    list: undefined,
  },
};
// continue here tomorrow
export const researchSlice = createSlice({
  name: 'research',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getResearchsAction.pending, (state) => {
        state.researchs.loading = true;
      })
      .addCase(getResearchsAction.fulfilled, (state, action) => {
        state.researchs.loading = false;
        state.researchs.list = action.payload.list;
      })
      .addCase(getResearchsAction.rejected, (state) => {
        state.researchs.loading = false;
        state.researchs.list = undefined;
      });
  },
});

export const getResearchsAction = createAsyncThunk(
  'auth/fetchResearchs',
  async (params: IGetListResearchParam) => {
    const res: IGetListResearchRes = await fetchResearchs(params);
    return res;
  }
);

export default researchSlice.reducer;

export const researchsListSelector = () =>
  useAppSelector((state: RootState) => state.research.researchs);
