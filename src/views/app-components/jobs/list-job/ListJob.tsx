// Libraries
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Input, notification, Popover, Space, Table, Tag } from 'antd';

// Hooks
import useDebounce from '@/hooks/debounce';

// Types
import { IResearch } from '@/types/research';

// Apis
import { deleteAResearch } from '@/apis/researchs';
import useGetListJob from './useGetListJob';

const { Search } = Input;
const { Column } = Table;

const ListJob: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [limit] = useState(10);
  const [page] = useState(1);
  const [search, setSearch] = useState<string>('');
  const debouncedSearch = useDebounce<string>(search);
  const [loading, listJob, onSearch] = useGetListJob();

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

  const onEditJob = (jobID: Number) => {
    navigate(`/job/create?job_id=${jobID}`);
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
      <Table loading={loading} rowKey='id' dataSource={listJob}>
        <Column title='Name' dataIndex='name' key='name' />
        <Column title='Working days' dataIndex='workingDays' key='workingDays' />
        <Column title='Position' dataIndex='position' key='position' />
        <Column title='Website' dataIndex='website' key='website' />
        <Column title='Salary from' dataIndex='salaryFrom' key='salaryFrom' />
        <Column title='Salary to' dataIndex='salaryTo' key='salaryTo' />
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IResearch) => (
            <Space size='middle'>
              <a onClick={() => onEditJob(record.id)}>Edit</a>
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

export default ListJob;
