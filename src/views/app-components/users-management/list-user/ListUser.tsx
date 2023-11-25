import React, { useEffect, useState } from 'react';
import { Input, Space, Table, Tag } from 'antd';
import { IUserInfo } from '../../../../types/users';
import useGetListUser from './useGetListUser';
import useDebounce from '@/hooks/debounce';

const { Search } = Input;
const { Column } = Table;

const ListUser: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listUser, onSearch] = useGetListUser();

  const onChange = (event: React.ChangeEvent<HTMLInputElement> | undefined) => {
    let value = '';
    if (event) {
      value = event.target.value;
    }
    setSearch(value);
  };

  useEffect(() => {
    onSearch(search, page);
  }, [debouncedSearch]);

  const onSearchKeyChange = (searchKey: string) => {
    onSearch(searchKey, page);
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Search
        placeholder='Search by first name'
        onSearch={onSearchKeyChange}
        onChange={onChange}
        style={{ width: 200 }}
      />
      <Table loading={loading} rowKey='id' dataSource={listUser}>
        <Column title='Email' dataIndex='email' key='email' />
        <Column
          title='Phone Number'
          dataIndex='phoneNumber'
          key='phoneNumber'
        />
        <Column title='User Name' dataIndex='username' key='username' />
        <Column title='First Name' dataIndex='firstname' key='firstname' />
        <Column title='Last Name' dataIndex='lastname' key='lastname' />
        {/* <Column
          title='Date of birth'
          dataIndex='dateOfBirth'
          key='dateOfBirth'
        /> */}
        <Column
          title='Status'
          dataIndex='status'
          key='status'
          render={(_: any, record: IUserInfo) => (
            <Tag color='blue'>{record.status}</Tag>
          )}
        />

        <Column
          title='Address'
          key='address'
          render={(_: any, record: IUserInfo) => (
            <>
              {record.address?.street ||
                '' + ' ' + (record.address?.province || '')}
            </>
          )}
        />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IUserInfo) => (
            <Space size='middle'>
              <a>Edit {record.name}</a>
              <a>Delete</a>
            </Space>
          )}
        />
      </Table>
    </Space>
  );
};

export default ListUser;
