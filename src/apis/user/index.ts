import apiRequest from '../apiRequest';
import { userURL } from '../constants';
import {
  ICreateUserParams,
  IGetUserParams,
  IGetUserResponse,
  IUpdateUserParams,
} from './types';

export const apiGetUserList = async (params: IGetUserParams) => {
  const response = await apiRequest.get<IGetUserResponse>(userURL, { params });
  return response;
};

export const apiCreateUser = async (params: ICreateUserParams) => {
  const response = await apiRequest.post(userURL, params);
  return response;
};

export const apiUpdateUser = async (
  userId: number,
  params: IUpdateUserParams
) => {
  const response = await apiRequest.put(`${userURL}/${userId}`, params);
  return response;
};
