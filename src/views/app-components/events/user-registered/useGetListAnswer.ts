import { usersListSelector } from '@/_redux/features/user';
import { useAppDispatch } from '@/_redux/hooks';
import { IUserInfo } from '../../../../types/users';
import { eventsListAnswerSelector, getAnswersEventsAction } from '@/_redux/features/event';
import { useEffect } from 'react';

export default function useGetListAnswer(eventId: number): [
  boolean,
  IUserInfo[] | undefined,
  number,
  (searchKey: string, limit: number, page: number, eventId: number) => void
] {
  const { loading, list: listAnswer, total } = eventsListAnswerSelector();
  const dispatch = useAppDispatch();
  const getAnswerUsersRegister = (
    searchKey: string,
    limit: number,
    page: number,
    eventId: number
  ) => {
    dispatch(getAnswersEventsAction({ searchKey, page, limit, eventId, isTotal:true }));
  };

  useEffect(() => {
    if(eventId) {
      getAnswerUsersRegister('', 50, 1, eventId);
    }
  }, [eventId]);

  const onSearch = (
    searchKey: string,
    limit: number,
    page: number,
    eventId: number,
  ) => {
    getAnswerUsersRegister(searchKey, limit, page, eventId);
  };

  return [loading, listAnswer, total, onSearch];
}
