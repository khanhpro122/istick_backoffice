import { getUsersAction, usersListSelector } from '@/_redux/features/user';
import { useAppDispatch } from '@/_redux/hooks';
import { useEffect } from 'react';
import { IUserInfo } from '../../../../types/users';

export default function useGetListUser(): [
  boolean,
  IUserInfo[] | undefined,
  (searchKey: string, page: number) => void
] {
  const { loading, list: listUser } = usersListSelector();
  const dispatch = useAppDispatch();

  const getUsers = (searchKey: string, page: number) => {
    dispatch(getUsersAction({ searchKey, page, limit: 10 }));
  };

  useEffect(() => {
    getUsers('', 1);
  }, []);

  const onSearch = (searchKey: string, page: number) => {
    getUsers(searchKey, page);
  };

  return [loading, listUser, onSearch];
}
