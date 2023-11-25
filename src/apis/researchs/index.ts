import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { IResearch, ListResearch } from '@/types/research';

// list research
interface IGetListResearchParam {
  searchKey: string;
  limit: number;
  page: number;
}

interface IGetListResearchRes {
  list: ListResearch;
  status: boolean;
  message?: string;
}

const fetchResearchs = (params: IGetListResearchParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/post/list?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
        postType : 'RESEARCH'
      })}`
    )
    .then((res) => {
      const resData: IGetListResearchRes = {
        list: res?.data.list,
        status: true,
      };
      return resData;
    });
};

// get a research by id
interface IGetResearchParam {
  id: string;
  slug: string;
}

interface IGetResearchRes {
  data: IResearch;
  status: boolean;
  message?: string;
}

const fetchResearch = (params: IGetResearchParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/post/detail?${getQueryParams({
        id: params.id,
        slug: params.slug,
      })}`
    )
    .then((res) => {
      const resData: IGetResearchRes = {
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

const createAResearch = (params: IResearch) => {
  return axios
    .post(`${BASE_URL}/api/istick/v1/post/detail`, params)
    .then((res) => {
      const resData: ICreateEventRes = {
        status: true,
      };
      return resData;
    });
};

// delete a research
interface IDeleteResearchRes {
  status: boolean;
  message?: string;
}

const deleteAResearch = (id: number) => {
  return axios
    .delete(`${BASE_URL}/api/istick/v1/post/detail?ids=${id}`)
    .then((res) => {
      const resData: IDeleteResearchRes = {
        status: true,
      };
      return resData;
    });
};

export type { IGetListResearchParam, IGetListResearchRes };

export {
  fetchResearch,
  fetchResearchs,
  createAResearch,
  deleteAResearch,
};
