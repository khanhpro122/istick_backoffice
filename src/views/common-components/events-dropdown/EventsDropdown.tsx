import { Dropdown, notification, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import type { MenuProps } from 'antd';
import { fetchUsers } from '@/apis/users';
import { fetchEvents } from '@/apis/events';
import { useTranslation } from 'react-i18next';
import { IEvent, ListEvent } from '@/types/event';
import { ItemType } from 'antd/es/menu/hooks/useItems';

interface ItemProps {
  label: string;
  value: any;
}

export const EventsDropdown = ({ defaultValue, onChange }: any) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [events, setEvents] = useState<ListEvent>([]);

  useEffect(() => {
    setLoading(true);
    fetchEvents({
      limit: 50,
      page: 1,
      searchKey: '',
    })
      .then((data) => {
        setEvents(data.list);
        const items: ItemProps[] = data.list.map((event: IEvent) => {
          const item: ItemProps = {
            label: event.title,
            value: event.id,
          };
          return item;
        });
        setItems(items);
      })
      .catch(() => {
        notification.error({
          message: t('Get Events'),
          description: t('Something went wrong'),
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleChange = (value: any) => {
    const item = events.find((e) => e.id == value);
    onChange(item);
  };

  return (
    <Select
      loading={loading}
      style={{ width: 120 }}
      onChange={handleChange}
      options={items}
    />
  );
};

export default EventsDropdown;
