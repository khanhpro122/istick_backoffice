// Libraries
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, notification, Popover, Space, Table, Tag } from 'antd';

// Hooks
import useDebounce from '@/hooks/debounce';
import useGetListResearch from './useGetListResearch';

// Types
import { IResearch } from '@/types/research';

// Apis
import { deleteAResearch } from '@/apis/researchs';

const { Search } = Input;
const { Column } = Table;

const ListResearch: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listEvent, onSearch] = useGetListResearch();

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

  const onEditResearch = (researchID: Number) => {
    navigate(`/research/create?research_id=${researchID}`);
  };
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

  const deleteResearch = (id: number) => {
    let title = 'Delete Research';
    deleteAResearch(id)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t(title),
            description: t('Successful'),
          });
          onSearch({ searchKey: search, limit, page });
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
    <Space direction='vertical' style={{ width: '100%' }}>
      <Search
        placeholder='Search by title'
        onSearch={onSearchInput}
        onChange={onChange}
        style={{ width: 200 }}
      />
      <Table loading={loading} rowKey='id' dataSource={listEvent}>
        <Column title='Slug' dataIndex='slug' key='slug' />
        <Column title='Title' dataIndex='title' key='title' />
        <Column
          title='Banner Image'
          dataIndex='bannerUrl'
          key='bannerUrl'
          render={(_: any, record: IResearch) => (
            <a target='#blank' href={record.bannerUrl}>
              <img width={100} src={record.bannerUrl} alt='Banner Image' />
            </a>
          )}
        />
        <Column title='type' dataIndex='type' key='type' />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IResearch) => (
            <Space size='middle'>
              <a onClick={() => onEditResearch(record.id)}>Edit</a>
              <Popover
                content={
                  <>
                    <Button
                      onClick={() => deleteResearch(record.id)}
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

export default ListResearch;
