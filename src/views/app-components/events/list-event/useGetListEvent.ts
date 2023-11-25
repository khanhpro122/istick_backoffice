import { IGetListEventParam } from '@/apis/events';
import { ListEvent } from '@/types/event';
import { eventsListSelector, getEventsAction } from '@/_redux/features/event';
import { useAppDispatch } from '@/_redux/hooks';
import { useEffect } from 'react';
import { IUserInfo } from '../../../../types/users';

export default function useGetListEvent(): [
  boolean,
  ListEvent | undefined,
  (params: IGetListEventParam) => void
] {
  const { loading, list: listEvent } = eventsListSelector();
  const dispatch = useAppDispatch();

  const getEvents = (params: IGetListEventParam) => {
    dispatch(getEventsAction(params));
  };

  const onSearch = (params: IGetListEventParam) => {
    getEvents(params);
  };

  return [loading, listEvent, onSearch];
}
