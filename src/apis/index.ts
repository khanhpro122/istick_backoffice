import axios from 'axios';
import {
  clearToken,
  clearUserInfo,
  getRefreshToken,
  getToken,
} from '../helpers/storage';

axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    const refreshToken = getRefreshToken();
    if (token) {
      config.headers['AccessToken'] = token;
      config.headers['RefreshToken'] = refreshToken;
    }
    return config;
  },
  (err) => {
    Promise.reject(err);
  }
);

axios.interceptors.response.use(undefined, (err) => {
  if (
    err.response &&
    err.response.status === 401 &&
    err.config?.url?.includes('users/self-info')
  ) {
    clearUserInfo();
    clearToken();
    window.location.href = '/bo/login';
    return;
  }
  if (err?.response?.data) {
    return Promise.reject(err.response.data);
  }
  return Promise.reject(err.response);
});

export const getQueryParams = (params: any): string => {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      if (params[key] && Array.isArray(params[key])) {
        console.log(params[key]);
        params[key].forEach((value: any) => {
          console.log(key, value);
          searchParams.append(key, value);
        });
      } else if (params[key]) {
        searchParams.append(key, params[key]);
      }
    }
  });
  return searchParams.toString();
};
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://istick.io';
