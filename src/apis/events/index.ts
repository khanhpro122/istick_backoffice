import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { IEvent, ListEvent } from '@/types/event';

// list event
interface IGetListEventParam {
  searchKey: string;
  limit: number;
  page: number;
}

interface IGetListRegisterEventParam {
  searchKey?: string;
  limit: number;
  page: number;
  eventId: number | string;
  isTotal: boolean
}

interface IGetListRegisterEventParam {
  searchKey?: string;
  limit: number;
  page: number;
  eventId: number | string;
  isTotal: boolean
}

interface IGetListSendedParam {
  searchKey?: string;
  limit: number;
  page: number;
  isTotal: boolean
}

interface IGetListEventRes {
  list: ListEvent;
  status: boolean;
  message?: string;
  total?: number
}

const fetchEvents = (params: IGetListEventParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/event/list?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
      })}`
    )
    .then((res) => {
      const resData: IGetListEventRes = {
        list: res?.data.list,
        status: true,
      };
      return resData;
    });
};

const fetchResgisterEvents = (params: IGetListRegisterEventParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/event/${params?.eventId}/registered-users?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
        isTotal: params.isTotal
      })}`
    )
    .then((res) => {
      const resData: IGetListEventRes = {
        list: res?.data.list,
        status: true,
        total: res?.data?.total
      };
      return resData;
    });
};

const fetchListSended = (params: IGetListSendedParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/event/event-sent-mails?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
        isTotal: params.isTotal
      })}`
    )
    .then((res) => {
      const resData: IGetListEventRes = {
        list: res?.data.list,
        status: true,
        total: res?.data?.total
      };
      return resData;
    });
};


// get a event by id
interface IGetEventParam {
  id: string;
  slug: string;
}

interface IGetEventRes {
  data: IEvent;
  status: boolean;
  message?: string;
}

const fetchEvent = (params: IGetEventParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/event/detail?${getQueryParams({
        event_id: params.id,
        slug: params.slug,
      })}`
    )
    .then((res) => {
      const resData: IGetEventRes = {
        data: res?.data,
        status: true,
      };
      return resData;
    });
};

// create a event
interface ICreateEventRes {
  status: boolean;
  message?: string;
}

const createAEvent = (params: IEvent) => {
  return axios
    .post(`${BASE_URL}/api/istick/v1/event`, params)
    .then((res) => {
      const resData: ICreateEventRes = {
        status: true,
      };
      return resData;
    });
};

const updateAEvent = (data: IEvent, eventId: any) => {
  return axios
    .put(`${BASE_URL}/api/istick/v1/event/${eventId}`, data)
    .then((res) => {
      const resData: ICreateEventRes = {
        status: true,
      };
      return resData;
    });
};

// delete a event
interface IDeleteEventRes {
  status: boolean;
  message?: string;
}

const deleteAEvent = (id: number) => {
  return axios
    .delete(`${BASE_URL}/api/istick/v1/event/${id}`)
    .then((res) => {
      const resData: IDeleteEventRes = {
        status: true,
      };
      return resData;
    });
};

interface IDeleteEventRes {
  status: boolean;
  message?: string;
}

const deleteRegisteredEventOfUser = (userId: number, eventId: number) => {
  return axios
    .delete(
      `${BASE_URL}/api/istick/v1/event/${eventId}/${userId}`
    )
    .then((res) => {
      const resData: IDeleteEventRes = {
        status: true,
      };
      return resData;
    });
};

const viewAnswerEvent = (params: any) => {
  const {eventId, ...rest} = params
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/event/${eventId}/answers?${getQueryParams({
        searchKey: rest.searchKey,
        limit: rest.limit,
        page: rest.page,
      })}`
    )
    .then((res) => {
      return res?.data;
    });
}

const remindUser = (params: any) => {
  const {eventId, ...rest} = params
  return axios
    .post(
      `${BASE_URL}/api/istick/v1/event/${eventId}/remind`, rest
    )
    .then((res) => {
      return res?.data;
    });
}


export type { IGetListEventParam, IGetListEventRes, IGetListRegisterEventParam, IGetListSendedParam };

export {
  fetchEvent,
  fetchEvents,
  createAEvent,
  deleteAEvent,
  deleteRegisteredEventOfUser,
  updateAEvent,
  fetchResgisterEvents,
  viewAnswerEvent,
  remindUser,
  fetchListSended
};
