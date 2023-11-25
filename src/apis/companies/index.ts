import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { ListJob, TJob } from '@/types/jobs';
import { ListCompany, TCompany } from '@/types/company';

// list job
interface IGetListCompanyParam {
  searchKey: string;
  limit: number;
  page: number;
}

interface IGetListCompanyRes {
  list: ListCompany;
  status: boolean;
  message?: string;
}

const fetchCompanies = (params: IGetListCompanyParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/companies?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
      })}`
    )
    .then((res) => {
      const resData: IGetListCompanyRes = {
        list: res?.data.list,
        status: true,
      };
      return resData;
    });
};


// get a company by id
interface IGetCompanyParam {
  id: string;
  slug: string;
}

interface IGetCompanyRes {
  data: TCompany;
  status: boolean;
  message?: string;
}

const fetchDetailsCompany = (companyId: string | number) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/sys/companies/${companyId}`
    )
    .then((res) => {
      const resData: IGetCompanyRes = {
        data: res?.data,
        status: true,
      };
      return resData;
    });
};

// create a company
interface ICreateCompanyRes {
  status: boolean;
  message?: string;
}

const createACompany = (params: TJob) => {
  return axios
    .post(`${BASE_URL}/api/istick/v1/internal/sys/companies`, params)
    .then((res) => {
      const resData: ICreateCompanyRes = {
        status: true,
      };
      return resData;
    });
};

// delete a company
interface IDeleteCompanyRes {
  status: boolean;
  message?: string;
}

const deleteACompany = (id: number) => {
  return axios
    .delete(`${BASE_URL}/api/istick/v1/internal/sys/companies/${id}`)
    .then((res) => {
      const resData: IDeleteCompanyRes = {
        status: true,
      };
      return resData;
    });
};

export type { IGetCompanyParam, IGetCompanyRes, IGetListCompanyRes, IGetListCompanyParam };

export {
  fetchCompanies,
  fetchDetailsCompany,
  createACompany,
  deleteACompany,
};
