import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { IAddress, ListUser } from '../../types/users';

interface IGetListUserParam {
  page: number;
  limit: number;
  searchKey: string;
  eventIds?: number[];
}

interface IGetListUserRes {
  list: ListUser;
  total: number;
  status: boolean;
  message?: string;
}

const fetchUsers = (params: IGetListUserParam) => {
  let paramsUrls = getQueryParams({
    isTotal: true,
    page: params.page,
    limit: params.limit,
    searchKey: params.searchKey,
    eventIds: params.eventIds,
  });
  return axios
    .get(`${BASE_URL}/api/istick/v1/rbac/user/list?${paramsUrls}`)
    .then((res) => {
      const resData: IGetListUserRes = {
        list: res?.data?.list,
        total: res?.data?.total,
        status: true,
      };
      return resData;
    });
};

interface ICreateUserParam {
  email: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  address: IAddress;
}

interface ICreateUserRes {
  list: ListUser;
  status: boolean;
  message?: string;
}

const createAUser = (params: ICreateUserParam) => {
  return axios.post(`${BASE_URL}/api/v1/users`, params).then((res) => {
    const resData: ICreateUserRes = {
      list: res.data,
      status: true,
    };
    return resData;
  });
};

export type { IGetListUserParam, IGetListUserRes };

export { fetchUsers, createAUser };
