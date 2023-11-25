// Redux
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';
import { ListCompany } from '@/types/company';
import { IGetListCompanyParam, IGetListCompanyRes, fetchCompanies } from '@/apis/companies';

// Types

export interface CompaniesState {
  companies: {
    loading: boolean;
    list: ListCompany | undefined;
  };
}

const initialState: CompaniesState = {
  companies: {
    loading: false,
    list: undefined,
  },
};
// continue here tomorrow
export const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCompaniesAction.pending, (state) => {
        state.companies.loading = true;
      })
      .addCase(getCompaniesAction.fulfilled, (state, action) => {
        state.companies.loading = false;
        state.companies.list = action.payload.list;
      })
      .addCase(getCompaniesAction.rejected, (state) => {
        state.companies.loading = false;
        state.companies.list = undefined;
      });
  },
});

export const getCompaniesAction = createAsyncThunk(
  'auth/fetchCompanies',
  async (params: IGetListCompanyParam) => {
    const res: IGetListCompanyRes = await fetchCompanies(params);
    return res;
  }
);

export default companySlice.reducer;

export const companiesListSelector = () =>
  useAppSelector((state: RootState) => state.company.companies);
