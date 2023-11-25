import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../hooks';
import { RootState } from '../store';
import { ListPackage } from '@/types/package';
import { IGetListPackageParam, IGetListPackageRes, fetchPackages } from '@/apis/packages';

export interface PackagesState {
  packages: {
    loading: boolean;
    list: ListPackage | undefined;
  };
}

const initialState: PackagesState= {
  packages: {
    loading: false,
    list: undefined,
  },
};
// continue here tomorrow
export const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPackagesAction.pending, (state) => {
        state.packages.loading = true;
      })
      .addCase(getPackagesAction.fulfilled, (state, action) => {
        state.packages.loading = false;
        state.packages.list = action.payload.list;
      })
      .addCase(getPackagesAction.rejected, (state) => {
        state.packages.loading = false;
        state.packages.list = undefined;
      })
  },
});

export const getPackagesAction = createAsyncThunk(
  'auth/fetchPackage',
  async (params: IGetListPackageParam) => {
    const res: IGetListPackageRes = await fetchPackages(params);
    return res;
  }
);

export default packageSlice.reducer;

export const packagesListSelector = () =>
  useAppSelector((state: RootState) => state.package.packages);

