/* eslint-disable no-param-reassign */
/* eslint-disable prefer-promise-reject-errors */
import axios, { AxiosError, AxiosResponse } from 'axios';

import queryClient from './queryClient';
import { CustomSwal } from '../components/custom-swal';
import { baseURL } from './constants';
import { getRefreshToken, getToken } from '@/helpers/storage';

interface IApiErrorResponse {
  status: number;
  error: string;
  message: string;
  errors?: any;
}

const apiRequest = axios.create({
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // 'Accept-Language': `${language()}`,
    Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    AccessToken: getToken(),
    RefreshToken: getRefreshToken(),
  },
  // baseURL: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? '' : baseURL,
});

const handleResponseSuccess = (response: AxiosResponse) => {
  return response;
};

const resetAuth = async () => {
  queryClient.clear();
  localStorage.clear();
  window.location.reload();
};

const handleResponseError = async (error: AxiosError<IApiErrorResponse>) => {
  if (axios.isAxiosError(error)) {
    const { response } = error;
    console.log(error);

    if (response?.status === 401 && error.config?.url?.includes('self-info')) {
      if (!CustomSwal.isVisible()) {
        resetAuth();
        CustomSwal.fire({
          text: 'Session Expired. Please login again.',
          icon: 'warning',
          allowOutsideClick: false,
        });
      }

      return Promise.reject({
        status: 401,
        error: 'Unauthorized',
        message: 'Unauthorized',
      });
    }
    switch (response?.status) {
      case 403:
        if (!CustomSwal.isVisible()) {
          if (response.data.message === 'password.request.expired') {
            CustomSwal.fire({
              title: response.data.error,
              text: 'Password request expired',
              icon: 'warning',
              allowOutsideClick: false,
            });
          } else {
            CustomSwal.fire({
              text: response.data.error || error.message,
              icon: 'warning',
              allowOutsideClick: false,
            });
          }
        }
        break;
      case 404:
        if (!CustomSwal.isVisible()) {
          CustomSwal.fire({
            title: '404 API resource not found.',
            text: 'Please contact administrator for details.',
            icon: 'warning',
            allowOutsideClick: false,
          });
        }
        break;
      case 500:
      case 502:
      case 503:
        if (!CustomSwal.isVisible()) {
          CustomSwal.fire({
            title: 'Internal Server Error',
            text: 'Please contact administrator for details.',
            icon: 'info',
            allowOutsideClick: false,
          });
        }
        break;
      default:
        break;
    }

    if (response) {
      return Promise.reject({
        ...response,
        status: response.data.status,
        error: response.data.error,
        message: response.data.message ?? response.data.error,
        ...(response.data.errors && { errors: response.data.errors }),
      });
    }
    return Promise.reject({
      ...error,
      status: error.code,
      error: error.name,
      message: error.message,
    });
  }

  return Promise.reject({
    message: 'Unknown error',
  });
};

apiRequest.interceptors.response.use(
  handleResponseSuccess,
  handleResponseError
);

export default apiRequest;
