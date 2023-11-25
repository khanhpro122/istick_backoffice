import { IAccountInfo } from '../types/account';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user';

const saveToken = (token: string, refreshToken: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const saveUserInfo = (userInfo: IAccountInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

const getUserInfo = (): IAccountInfo | null => {
  const userStr = localStorage.getItem(USER_INFO_KEY);
  if (typeof userStr === 'string') {
    const userInfo = JSON.parse(userStr) as IAccountInfo;
    return userInfo;
  }
  return null;
};

const clearUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

const IsLoggedIn = (): boolean => {
  const token = getToken();
  return token != '' && token != null;
};

export {
  saveToken,
  getToken,
  getRefreshToken,
  clearToken,
  saveUserInfo,
  getUserInfo,
  clearUserInfo,
  IsLoggedIn,
};
