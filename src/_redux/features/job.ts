import { IGetListJobRes, IGetListJobParam, fetchJobs } from '@/apis/jobs';
// Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

// Types
import { ListJob } from '@/types/jobs';

export interface JobsState {
  jobs: {
    loading: boolean;
    list: ListJob | undefined;
  };
}

const initialState: JobsState = {
  jobs: {
    loading: false,
    list: undefined,
  },
};
// continue here tomorrow
export const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getJobsAction.pending, (state) => {
        state.jobs.loading = true;
      })
      .addCase(getJobsAction.fulfilled, (state, action) => {
        state.jobs.loading = false;
        state.jobs.list = action.payload.list;
      })
      .addCase(getJobsAction.rejected, (state) => {
        state.jobs.loading = false;
        state.jobs.list = undefined;
      });
  },
});

export const getJobsAction = createAsyncThunk(
  'auth/fetchJobs',
  async (params: IGetListJobParam) => {
    const res: IGetListJobRes = await fetchJobs(params);
    return res;
  }
);

export default jobSlice.reducer;

export const jobsListSelector = () =>
  useAppSelector((state: RootState) => state.job.jobs);
