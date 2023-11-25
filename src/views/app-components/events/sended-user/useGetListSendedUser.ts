import { useAppDispatch } from '@/_redux/hooks';
import { IUserInfo } from '../../../../types/users';
import { eventsListSendedSelector, getListSendersAction } from '@/_redux/features/event';
import { useEffect } from 'react';

export default function useGetListSendedUser(): [
  boolean,
  IUserInfo[] | undefined,
  number,
  (searchKey: string, limit: number, page: number) => void
] {
  const { loading, list: listSendeds, total } = eventsListSendedSelector();
  const dispatch = useAppDispatch();
  const getListSended = (
    searchKey: string,
    limit: number,
    page: number,
  ) => {
    dispatch(getListSendersAction({ searchKey, page, limit, isTotal:true }));
  };

  useEffect(() => {
    getListSended('', 10, 1);
  }, []);

  const onSearch = (
    searchKey: string,
    limit: number,
    page: number,
  ) => {
    getListSended(searchKey, limit, page);
  };

  return [loading, listSendeds, total, onSearch];
}
