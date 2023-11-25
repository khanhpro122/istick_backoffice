import { UserType } from '@/types/users';
import axios from 'axios';
import { BASE_URL } from '..';
import { IAccountInfo } from '../../types/account';
import Cookies from 'js-cookie';

interface ILoginParam {
  username: string;
  password: string;
  userType: UserType;
}

interface ILoginResponse {
  username: string;
  token: string;
  refreshToken: string;
}

const login = (param: ILoginParam) => {
  const loginParam = {
    username: param.username,
    password: param.password,
    userType: param.userType,
  };
  return axios
    .post(`${BASE_URL}/api/istick/v1/internal/iam/users/login`, loginParam)
    .then((res) => {
      const loginRes: ILoginResponse = {
        username: param.username,
        token: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      };
      // Cookies.set('access_token', res.headers['access_token']);
      // Cookies.set('refresh_token', res.headers['refresh_token']);
      return loginRes;
    });
};

const getAccountInfo = () => {
  return axios
    .get(`${BASE_URL}/api/istick/v1/internal/iam/users/self-info`)
    .then((res) => {
      const resData: IAccountInfo = res.data as IAccountInfo;
      return resData;
    });
};

export type { ILoginParam, ILoginResponse };

export { login, getAccountInfo };
