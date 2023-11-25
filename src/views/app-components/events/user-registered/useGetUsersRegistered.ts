import { usersListSelector } from '@/_redux/features/user';
import { useAppDispatch } from '@/_redux/hooks';
import { IUserInfo } from '../../../../types/users';
import { eventsListRegisterSelector, getResgisterEventsAction } from '@/_redux/features/event';
import { useEffect } from 'react';
import { IGetListRegisterEventParam } from '@/apis/events';

interface Props {
  params: IGetListRegisterEventParam
}


export default function useGetUsersRegistered(): [
  boolean,
  any[] | undefined,
  number,
  (params : IGetListRegisterEventParam) => void,
] {
  const { loading, list: listRegister, total } = eventsListRegisterSelector();
  const dispatch = useAppDispatch();
  const getUsersRegister = (
    params: IGetListRegisterEventParam
  ) => {
    dispatch(getResgisterEventsAction(params));
  };

  const onSearch = (
    params: IGetListRegisterEventParam
  ) => {
    getUsersRegister(params);
  };

  return [loading, listRegister, total, onSearch];
}
