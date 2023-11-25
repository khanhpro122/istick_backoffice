export interface IGetRoleListResponse {
  list: {
    id: number;
    name: string;
    updatedBy: string;
  }[];
  total: number;
}

export interface IGetRoleParams {
  limit: number;
  page: number;
  isTotal: boolean;
}

export interface IGetPermissionListResponse {
  permissions: [
    {
      action: string;
      id: 0;
      target: string;
    }
  ];
}

export interface IGetPermissionParams {
  roleIds?: number[];
}

export interface ICreateRoleParams {
  permissionIds: number[];
  roleName: string;
}
