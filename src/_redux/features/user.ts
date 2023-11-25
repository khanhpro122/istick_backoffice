import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ListUser } from '@/types/users';
import { fetchUsers, IGetListUserParam, IGetListUserRes } from '@/apis/users';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

export interface UsersState {
  users: {
    loading: boolean;
    list: ListUser | undefined;
    total: number;
  };
}

const initialState: UsersState = {
  users: {
    loading: false,
    list: undefined,
    total: 0,
  },
};
// continue here tomorrow
export const userSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersAction.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(getUsersAction.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload.list;
        state.users.total = action.payload.total;
      })
      .addCase(getUsersAction.rejected, (state) => {
        state.users.loading = false;
        state.users.list = undefined;
        state.users.total = 0;
      });
  },
});

export const getUsersAction = createAsyncThunk(
  'rbac/fetchUsers',
  async (params: IGetListUserParam) => {
    const res: IGetListUserRes = await fetchUsers(params);
    return res;
  }
);

export default userSlice.reducer;

export const usersListSelector = () =>
  useAppSelector((state: RootState) => state.user.users);
