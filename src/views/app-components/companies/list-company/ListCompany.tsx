// Libraries
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, notification, Popover, Space, Table, Tag } from 'antd';

// Hooks
import useDebounce from '@/hooks/debounce';

// Types
import { TCompany } from '@/types/company';

// Apis
import useGetListCompany from './useGetListCompany';
import { deleteACompany } from '@/apis/companies';

const { Search } = Input;
const { Column } = Table;

const ListCompany: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listCompany, onSearch] = useGetListCompany();

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

  const onEditCompany = (companyId: Number) => {
    navigate(`/company/create?company_id=${companyId}`);
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

  const deleteCompany = (id: number) => {
    let title = 'Delete Company';
    deleteACompany(id)
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
      <Table loading={loading} rowKey='id' dataSource={listCompany}>
        <Column title='Slug' dataIndex='slug' key='slug' />
        <Column title='Name' dataIndex='name' key='name' />
        <Column title='Company Size From' dataIndex='companySizeFrom' key='companySizeFrom' />
        <Column title='Company Size To' dataIndex='companySizeTo' key='companySizeTo' />
        <Column title='website' dataIndex='website' key='website' />
        <Column title='Working Days' dataIndex='workingDays' key='workingDays' />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: TCompany) => (
            <Space size='middle'>
              <a onClick={() => onEditCompany(record.id)}>Edit</a>
              <Popover
                content={
                  <>
                    <Button
                      onClick={() => deleteCompany(record.id)}
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

export default ListCompany;
