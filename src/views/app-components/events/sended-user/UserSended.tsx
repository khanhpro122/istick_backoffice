import React, { useEffect, useState } from 'react';
import { Input, Space, Table } from 'antd';
import useDebounce from '@/hooks/debounce';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import useGetListSendedUser from './useGetListSendedUser';
import { BASE_URL, getQueryParams } from '@/apis';
import axios from 'axios';

const { Search } = Input;
const { Column } = Table;

const limit = 10;

const UsersSended: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    searchKey: "",
  })
  const [loading, listSended, total, onSearch] = useGetListSendedUser();
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearch = useDebounce(searchValue, 300)
  const [objectEvent, setObjectEvent] = useState<any>({})
  const [objectRegister, setObjectRegister] = useState<any>({})
  
  useEffect(() => {
    setParams({...params, searchKey: debouncedSearch})
  }, [debouncedSearch]);

  useEffect(() => {
    // onSearch({...params, limit: 10})
  }, [params])
  
  const fetchAllEvents = async () => {
    axios
    .get(
      `${BASE_URL}/api/istick/v1/event/list?${getQueryParams({
        searchKey: params.searchKey,
        limit: params.limit,
        page: params.page,
      })}`
    )
    .then((res) => {
      if(res?.data) {
        const result:any = {}
        res.data.list?.forEach((event: any) => {
          result[event.id] = event.title
        })
        setObjectEvent(result)
      }
    });
  }

  useEffect(() => {
    fetchAllEvents()
  }, [])

  const onSearchKeyChange = (e: any) => {
    setSearchValue(e.target.value)
  };

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Space style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Search
          placeholder='Search by first name'
          onChange={onSearchKeyChange}
          style={{ width: 200 }}
        />
        {/* <EventsDropdown onChange={onEventFilterChange} /> */}
      </Space>
      <Table
        loading={loading}
        rowKey='id'
        dataSource={listSended}
        pagination={{
          pageSize: params.limit,
          current: params.page,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            total: total,
            showTotal: () => `Total ${total}`,
            onChange: (page, pageSize) => {
              setParams({
                ...params,
                page: page ? page : params.page,
                limit: pageSize ? pageSize : params.limit
              })
            }
        }}
      >
        <Column
          title='User name'
          dataIndex='userName'
          key='userName'
          render={(_: any, record: any) => (
            <div>{record?.UserID}</div>
          )}
        />
        <Column
          title='Event name'
          dataIndex='nameEvent'
          key='nameEvent'
          render={(_: any, record: any) => (
            <div>{objectEvent?.[record?.EventID]}</div>
          )}
        />
        <Column
          title='Status'
          dataIndex='status'
          key='status'
          render={(_: any, record: any) => (
            <div>{record?.Status}</div>
          )}
        />
      </Table>
    </Space>
  );
};

export default UsersSended;
