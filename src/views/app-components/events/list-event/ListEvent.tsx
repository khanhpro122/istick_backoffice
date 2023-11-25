import React, { useEffect, useState } from 'react';
import { Button, Input, notification, Popover, Space, Table, Tag } from 'antd';
import { IUserInfo } from '../../../../types/users';
import useDebounce from '@/hooks/debounce';
import useGetListEvent from './useGetListEvent';
import { IEvent } from '@/types/event';
import { useNavigate } from 'react-router-dom';
import { deleteAEvent, fetchEvent } from '@/apis/events';
import { useTranslation } from 'react-i18next';

const { Search } = Input;
const { Column } = Table;

const ListEvent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listEvent, onSearch] = useGetListEvent();

  const onChange = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    let value = '';
    if (event) {
      value = event.target.value;
    }
    setSearch(value);
  };

  const onSearchInput = (search: string) => {
    onSearch({ searchKey: search, limit, page });
  };

  useEffect(() => {
    onSearch({ searchKey: search, limit, page });
  }, [debouncedSearch]);

  const onEditEvent = (eventID: Number) => {
    navigate(`/event/create?event_id=${eventID}`);
  };

  const onViewRegister = (eventID: number) => {
    navigate(`/event/user-registered?event_id=${eventID}`);
  }

  // delete popover
  const [open, setOpen] = useState<any>({});

  const hide = (id: number) => {
    let newOpen = { ...open, [id]: false };
    setOpen(newOpen);
  };

  const handleOpenChange = (id: number, newOpen: boolean) => {
    let newOpenData = { ...open, [id]: newOpen };
    setOpen(newOpenData);
  };

  const deleteEvent = (id: number) => {
    let title = 'Delete Event';
    deleteAEvent(id)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t(title),
            description: t('Successful'),
          });
          useEffect(() => {
            onSearch({ searchKey: search, limit, page });
          }, [debouncedSearch]);
        }
      })
      .catch((err) => {
        notification.error({
          message: t(title),
          description: t('Something went wrong'),
        });
      })
      .finally(() => {
        hide(id);
      });
  };

  return (
    <Space direction='vertical' style={{ width: '100%', overflow: 'auto' }}>
      <Search
        placeholder='Search by title'
        onSearch={onSearchInput}
        onChange={onChange}
        style={{ width: 200 }}
      />
      <Table loading={loading} rowKey='id' dataSource={listEvent} scroll={{ y: 400 }}>
        <Column title='Slug' dataIndex='slug' key='slug' />
        <Column title='Title' dataIndex='title' key='title' />
        <Column
          title='Banner Image'
          dataIndex='bannerUrl'
          key='bannerUrl'
          render={(_: any, record: IEvent) => (
            <a target='#blank' href={record.bannerUrl}>
              <img width={100} src={record.bannerUrl} alt='Banner Image' />
            </a>
          )}
        />
        <Column title='Host' dataIndex='host' key='host' />
        <Column title='Cost' dataIndex='cost' key='cost' />
        <Column
          title='Type'
          dataIndex='types'
          key='types'
          render={(_: any, record: IEvent) =>
            record.types.map((type) => <Tag color='blue'>{type}</Tag>)
          }
        />
        <Column
          title='Registration Deadline'
          dataIndex='registrationDeadline'
          key='registrationDeadline'
        />
        <Column title='Start Date' dataIndex='startDate' key='startDate' />
        <Column title='End Date' dataIndex='endDate' key='endDate' />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IEvent) => (
            <Space size='middle'>
              <a onClick={() => onViewRegister(record.id)}>View register</a>
              <a onClick={() => onEditEvent(record.id)}>Edit</a>
              <Popover
                content={
                  <>
                    <Button
                      onClick={() => deleteEvent(record.id)}
                      danger
                      type='text'
                    >
                      Delete
                    </Button>
                    <a onClick={() => hide(record.id)}>Close</a>
                  </>
                }
                title='Are you sure?'
                trigger='click'
                open={open[record.id] ? true : false}
                onOpenChange={(newOpen) => handleOpenChange(record.id, newOpen)}
              >
                <a>Delete</a>
              </Popover>
            </Space>
          )}
        />
      </Table>
    </Space>
  );
};

export default ListEvent;
