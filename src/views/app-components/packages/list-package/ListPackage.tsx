import React, { useEffect, useState } from 'react';
import { Button, Input, notification, Popover, Space, Table } from 'antd';
import useDebounce from '@/hooks/debounce';
import { IEvent } from '@/types/event';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useGetListPackage from './useGetListPackage';
import { IPackage } from '@/types/package';
import { deleteAPackage } from '@/apis/packages';

const { Search } = Input;
const { Column } = Table;

const ListPackage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listPackage, onSearch] = useGetListPackage();

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

  const onEditPackage = (packageId: Number | string) => {
    navigate(`/package/create?package_id=${packageId}`);
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

  const deletePackage = (id: number) => {
    let title = 'Delete Package';
    deleteAPackage(id)
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
      <Table loading={loading} rowKey='id' dataSource={listPackage} scroll={{ y: 400 }}>
        <Column title='Name' dataIndex='name' key='name' />
        <Column title='Expiration Period' dataIndex='expirationPeriod' key='expirationPeriod' />
        <Column title='Display Order' dataIndex='displayOrder' key='displayOrder' />
        <Column title='Display Position' dataIndex='displayPosition' key='displayPosition' />
        <Column title='Display InSection' dataIndex='displayInSection' key='displayInSection' />
        <Column title='Repost Job' dataIndex='repostJob' key='repostJob' />
        <Column title='Repost Job Day Period' dataIndex='repostJobDayPeriod' key='repostJobDayPeriod' />
        <Column
          title='Email Notification'
          key='emailNotification'
          render={(_: any, record: IPackage) => (
           <span>{record?.emailNotification ? "true" : "false"}</span>
          )}
        />
        <Column title='Description' dataIndex='description' key='description' />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IEvent) => (
            <Space size='middle'>
              <a onClick={() => onEditPackage(record.slug)}>Edit</a>
              <Popover
                content={
                  <>
                    <Button
                      onClick={() => deletePackage(record.id)}
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

export default ListPackage;
