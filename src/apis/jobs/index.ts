import axios from 'axios';
import { BASE_URL, getQueryParams } from '..';
import { ListJob, TJob } from '@/types/jobs';

// list job
interface IGetListJobParam {
  searchKey: string;
  limit: number;
  page: number;
}

interface IGetListJobRes {
  list: ListJob;
  status: boolean;
  message?: string;
}

const fetchJobs = (params: IGetListJobParam) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/landing/jobs/job-seeking?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
      })}`
    )
    .then((res) => {
      const resData: IGetListJobRes = {
        list: res?.data.list,
        status: true,
      };
      return resData;
    });
};


// get a job by id
interface IGetJobParam {
  id: string;
  slug: string;
}

interface IGetJobRes {
  data: TJob;
  status: boolean;
  message?: string;
}

const fetchDetailsJob = (jobId: string | number) => {
  return axios
    .get(
      `${BASE_URL}/api/istick/v1/internal/hire/jobs/${jobId}`
    )
    .then((res) => {
      const resData: IGetJobRes = {
        data: res?.data,
        status: true,
      };
      return resData;
    });
};

// create a job
interface ICreateJobRes {
  status: boolean;
  message?: string;
}

const createAJob = (params: TJob) => {
  return axios
    .post(`${BASE_URL}/api/istick/v1/internal/hire/jobs`, params)
    .then((res) => {
      const resData: ICreateJobRes = {
        status: true,
      };
      return resData;
    });
};

// delete a jobs
interface IDeleteJobRes {
  status: boolean;
  message?: string;
}

const deleteAJob = (id: number) => {
  return axios
    .delete(`${BASE_URL}/api/istick/v1/internal/hire/jobs/${id}`)
    .then((res) => {
      const resData: IDeleteJobRes = {
        status: true,
      };
      return resData;
    });
};

export type { IGetListJobParam, IGetListJobRes };

export {
  fetchJobs,
  fetchDetailsJob,
  createAJob,
  deleteAJob,
};
