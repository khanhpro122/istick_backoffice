import apiRequest from '../apiRequest';
import { roleURL } from '../constants';
import {
  ICreateRoleParams,
  IGetPermissionListResponse,
  IGetRoleListResponse,
  IGetRoleParams,
} from './types';

export const apiGetRoleList = async (params: IGetRoleParams) => {
  const response = await apiRequest.get<IGetRoleListResponse>(roleURL, {
    params,
  });
  return response;
};

export const apiGetPermissionList = async (params?: number) => {
  const url = params ? `?roleIds=${params}` : '';
  const response = await apiRequest.get<IGetPermissionListResponse>(
    `${roleURL}/permissions${url}`
  );
  return response;
};

export const apiCreateRole = async (params: ICreateRoleParams) => {
  const response = await apiRequest.post(roleURL, params);
  return response;
};

export const apiUpdateRole = async (
  roleId: number,
  params: ICreateRoleParams
) => {
  const response = await apiRequest.put(`${roleURL}/${roleId}`, params);
  return response;
};
