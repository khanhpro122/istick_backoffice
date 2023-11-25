import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ListEvent } from '@/types/event';
import {
  fetchEvents,
  fetchListSended,
  fetchResgisterEvents,
  IGetListEventParam,
  IGetListEventRes,
  IGetListRegisterEventParam,
  IGetListSendedParam,
  viewAnswerEvent,
} from '@/apis/events';
import { useAppSelector } from '../hooks';
import { RootState } from '../store';

export interface EventsState {
  events: {
    loading: boolean;
    list: ListEvent | undefined;
  };
  regiteredsEvent: {
    loading: boolean;
    list: any | undefined;
    total: number;
  };
  answers: {
    loading: boolean;
    list: any | undefined;
    total: number;
  };
  userSended: {
    loading: boolean;
    list: any | undefined;
    total: number;
  }
}

const initialState: EventsState = {
  events: {
    loading: false,
    list: undefined,
  },
  regiteredsEvent: {
    loading: false,
    list: undefined,
    total: 0,
  },
  answers: {
    loading: false,
    list: undefined,
    total: 0,
  },
  userSended: {
    loading: false,
    list: undefined,
    total: 0,
  }
};
// continue here tomorrow
export const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getEventsAction.pending, (state) => {
        state.events.loading = true;
      })
      .addCase(getEventsAction.fulfilled, (state, action) => {
        state.events.loading = false;
        state.events.list = action.payload.list;
      })
      .addCase(getEventsAction.rejected, (state) => {
        state.events.loading = false;
        state.events.list = undefined;
      })
      .addCase(getResgisterEventsAction.pending, (state) => {
        state.regiteredsEvent.loading = true;
      })
      .addCase(getResgisterEventsAction.fulfilled, (state, action) => {
        state.regiteredsEvent.loading = false;
        state.regiteredsEvent.list = action.payload.list;
        state.regiteredsEvent.total = action.payload.total || 0
      })
      .addCase(getResgisterEventsAction.rejected, (state) => {
        state.regiteredsEvent.loading = false;
        state.regiteredsEvent.list = undefined;
      })

      .addCase(getAnswersEventsAction.pending, (state) => {
        state.answers.loading = true;
      })
      .addCase(getAnswersEventsAction.fulfilled, (state, action) => {
        state.answers.loading = false;
        state.answers.list = action.payload.list;
      })
      .addCase(getAnswersEventsAction.rejected, (state) => {
        state.answers.loading = false;
        state.answers.list = undefined;
      })

      .addCase(getListSendersAction.pending, (state) => {
        state.userSended.loading = true;
      })
      .addCase(getListSendersAction.fulfilled, (state, action) => {
        state.userSended.loading = false;
        state.userSended.list = action.payload.list;
        state.userSended.total = action.payload.total;
      })
      .addCase(getListSendersAction.rejected, (state) => {
        state.userSended.loading = false;
        state.userSended.list = undefined;
      });
  },
});

export const getEventsAction = createAsyncThunk(
  'auth/fetchEvents',
  async (params: IGetListEventParam) => {
    const res: IGetListEventRes = await fetchEvents(params);
    return res;
  }
);

export const getResgisterEventsAction = createAsyncThunk(
  'auth/fetchRegisterEvents',
  async (params: IGetListRegisterEventParam) => {
    const res: IGetListEventRes = await fetchResgisterEvents(params);
    return res;
  }
);

export const getAnswersEventsAction = createAsyncThunk(
  'auth/fetchAnswerEvents',
  async (params: IGetListRegisterEventParam) => {
    const res: any = await viewAnswerEvent(params);
    return res;
  }
);

export const getListSendersAction = createAsyncThunk(
  'auth/fetchListSender',
  async (params: IGetListSendedParam) => {
    const res: any = await fetchListSended(params);
    return res;
  }
);

export default eventSlice.reducer;

export const eventsListSelector = () =>
  useAppSelector((state: RootState) => state.event.events);


export const eventsListRegisterSelector = () =>
useAppSelector((state: RootState) => state.event.regiteredsEvent);

export const eventsListAnswerSelector = () =>
useAppSelector((state: RootState) => state.event.answers);

export const eventsListSendedSelector = () =>
useAppSelector((state: RootState) => state.event.userSended);
