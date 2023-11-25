import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IAccountInfo } from '@/types/account';
import { getAccountInfo } from '@/apis/auth';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

export interface AuthState {
  account: {
    loading: boolean;
    accountData: IAccountInfo | undefined;
  };
}

const initialState: AuthState = {
  account: {
    loading: false,
    accountData: undefined,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAccountInfoAction.pending, (state) => {
        state.account.loading = true;
      })
      .addCase(getAccountInfoAction.fulfilled, (state, action) => {
        state.account.loading = false;
        state.account.accountData = action.payload;
      })
      .addCase(getAccountInfoAction.rejected, (state) => {
        state.account.loading = false;
        state.account.accountData = undefined;
      });
  },
});

export const getAccountInfoAction = createAsyncThunk(
  'auth/fetchAccount',
  async () => {
    const acc = await getAccountInfo();
    return acc;
  }
);

export default authSlice.reducer;

export const accountSelector = () =>
  useAppSelector((state: RootState) => state.auth.account);
