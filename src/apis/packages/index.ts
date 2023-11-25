import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { IEvent, ListEvent } from '@/types/event';
import { IPackage, ListPackage } from '@/types/package';

// list event
interface IGetListPackageParam {
  searchKey: string;
  limit: number;
  page: number;
}

interface IGetListPackageRes {
  list: ListPackage;
  message?: string;
  total?: number
}

const fetchPackages = (params: IGetListPackageParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/hire/packs?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
      })}`
    )
    .then((res) => {
      const resData: IGetListPackageRes = {
        list: res?.data.list,
      };
      return resData;
    });
};

// get a event by id

interface IGetPackageRes {
  data: IPackage;
  message?: string;
}

const fetchDetailsPackage = (packageId: number | string) => {
  console.log("packageId", packageId)
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/hire/packs/${packageId})}`
    )
    .then((res) => {
      const resData: IGetPackageRes = {
        data: res?.data,
      };
      return resData;
    });
};

// create a package
interface ICreatePackageRes {
  status: boolean;
  message?: string;
}

const fetchCreatePackage = (params: IEvent) => {
  return axios
    .post(`${BASE_URL}/api/istick/v1/internal/hire/packs`, params)
    .then((res) => {
      const resData: ICreatePackageRes = {
        status: true,
      };
      return resData;
    });
};
// delete a package
interface IDeletePackageRes {
  status: boolean;
  message?: string;
}

const deleteAPackage = (id: number) => {
  return axios
    .delete(`${BASE_URL}/api/v1/internal/hire/packs/${id}`)
    .then((res) => {
      const resData: IDeletePackageRes = {
        status: true,
      };
      return resData;
    });
};

const updateAPackage = (data: IEvent, eventId: any) => {
  return axios
    .put(`${BASE_URL}/api/v1/internal/hire/packs/${eventId}`, data)
    .then((res) => {
      const resData: ICreatePackageRes = {
        status: true,
      };
      return resData;
    });
};

const updateQuantityPackage = (data: any) => {
  const {packId, ...rest} = data
  return axios
    .post(`${BASE_URL}/api/v1/internal/hire/packs/${packId}/purchase`, rest)
    .then((res) => {
      const resData: ICreatePackageRes = {
        status: true,
      };
      return resData;
    });
};

export type { IGetPackageRes, IGetListPackageParam, IGetListPackageRes };

export {
  fetchDetailsPackage,
  fetchPackages,
  fetchCreatePackage,
  deleteAPackage,
  updateAPackage,
  updateQuantityPackage
};
