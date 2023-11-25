export interface IGetUserParams {
  limit: number;
  page: number;
  isTotal: boolean;
}

export interface IGetUserResponse {
  list: {
    id: number;
    username: string;
    roleId: number;
    roleName: string;
    status: string;
    updatedAt: string;
  }[];
  total: number;
}

export interface ICreateUserParams {
  password: string;
  roleId: number;
  userStatus: string;
  userType: string;
  username: string;
}

export interface IUpdateUserParams {
  username: string;
  roleId: number;
  userStatus: string;
}
