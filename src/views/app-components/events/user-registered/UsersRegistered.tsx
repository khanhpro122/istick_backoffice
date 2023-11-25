import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, notification, Popover, Space, Table, Tag } from 'antd';
import { IUserInfo } from '../../../../types/users';
import useGetUsersRegistered from './useGetUsersRegistered';
import useDebounce from '@/hooks/debounce';
import { useTranslation } from 'react-i18next';
import { deleteRegisteredEventOfUser, fetchEvent, remindUser } from '@/apis/events';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TQuestion } from '@/types/event';
import { convertValueMultiple, generateKey, mergeTwoData } from '@/utils';
import useGetListAnswer from './useGetListAnswer';
import { DownloadTableExcel } from 'react-export-table-to-excel';

const { Search } = Input;
const { Column } = Table;

const limit = 10;

const UsersRegistered: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id') || '';
  const slug = searchParams.get('slug') || '';
  const [params, setParams] = useState({
    limit: 10,
    page: 1,
    isTotal: true,
    searchKey: "",
    eventId,
  })
  const [loading, listRegister, total, onSearch] = useGetUsersRegistered();
  const [eventQuestions, setEventQuestions] = useState<TQuestion[]>([]);
  const [mapQuestion, setMapQuestion] = useState<any>({});
  const [convertedAnswers, setConvertedAnswers] = useState<any[]>([]);
  const [mergeData, setMergeData] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState("")
  const debouncedSearch = useDebounce(searchValue, 300)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [keyRemind, setKeyRemind] = useState("")
  const tableRef = useRef<any>(null)

  useEffect(() => {
    setParams({...params, searchKey: debouncedSearch})
  }, [debouncedSearch]);

  useEffect(() => {
    onSearch(params)
  }, [params])

  useEffect(() => {
    if (eventId) {
      fetchEvent({
        id: eventId,
        slug: slug,
      }).then((res:any) => {
        if(res?.data?.eventQuestions) {
          setEventQuestions(res?.data?.eventQuestions)
        }
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if(eventQuestions?.length) {
      const questionObject:any = {}
      eventQuestions?.forEach((ques:any) => {
        questionObject[ques?.id] = {
          question : ques?.content,
          questionType : ques?.questionType,
          value: ques?.questionType !== 'TEXT' ? convertValueMultiple(ques?.choices) : '',
        }
      });
      setMapQuestion(questionObject)
    }
  }, [eventQuestions])

  useEffect(() => {
    const result:any = mergeTwoData(listRegister, mapQuestion)
    setMergeData(result)
  }, [listRegister, mapQuestion])

  const onSearchKeyChange = (e: any) => {
    setSearchValue(e.target.value)
  };

  const deleteRegisteredEvent = (userId: number) => {
    let title = 'Delete Registered Event';
    if (!eventId) {
      notification.error({
        message: t(title),
        description: t('Please select a event'),
      });
    } else {
      // delete registered userId, eventId
      deleteRegisteredEventOfUser(userId, +eventId)
        .then((res) => {
          if (res.status) {
            notification.success({
              message: t(title),
              description: t('Successful'),
            });
            onSearch(params);
          }
        })
        .catch((err) => {
          notification.error({
            message: t(title),
            description: t('Something went wrong'),
          });
        })
        .finally(() => {
          hide(userId);
        });
    }
  };

  const [open, setOpen] = useState<any>({});
  const hide = (id: number) => {
    let newOpen = { ...open, [id]: false };
    setOpen(newOpen);
  };

  const handleOpenChange = (id: number, newOpen: boolean) => {
    let newOpenData = { ...open, [id]: newOpen };
    setOpen(newOpenData);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setSelectedRows(selectedRows?.map((item:any) => item.id))
    },
  };

  const handleRemindUser = () => {
    const params = {
        all: selectedRows.length === total,
        eventId,
        key: keyRemind,
        userIds: selectedRows
    }
    remindUser(params)
      .then((res) => {
        if (res.success) {
          notification.success({
            message: t("Remind user"),
            description: t('Successful'),
          });
          setKeyRemind("")
        }
      })
      .catch((err) => {
        notification.error({
          message: t("Remind user"),
          description: t('Something went wrong'),
        });
      })
  }

  return (
    <Space direction='vertical' style={{ width: '100%' }}>
      <Space style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Search
          placeholder='Search by first name'
          onChange={onSearchKeyChange}
          style={{ width: 200 }}
        />
        <div style={{display: "flex", alignItems: "center", gap: "6px"}}>
          <Input value={keyRemind} onChange={(e) => setKeyRemind(e.target.value)} placeholder='Enter key remind' />
          <Button disabled={!selectedRows.length || !keyRemind} onClick={handleRemindUser}>Remind</Button>
          <DownloadTableExcel
            filename="register-user"
            sheet="register"
            currentTableRef={tableRef.current}
          >
            <Button>Export excel</Button>
          </DownloadTableExcel>
        </div>

        {/* <EventsDropdown onChange={onEventFilterChange} /> */}
      </Space>
      <Table
        ref={tableRef}
        loading={loading}
        rowKey='id'
        dataSource={mergeData}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
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
        <Column title='Full Name' dataIndex='fullname' key='fullname' />
        <Column title='User Name' dataIndex='username' key='username' />
        <Column
          title='Status'
          dataIndex='status'
          key='status'
          render={(_: any, record: IUserInfo) => (
            <Tag color='blue'>{record.status}</Tag>
          )}
        />
        <Column
          title='Phone'
          key='phoneNumber'
          render={(_: any, record: IUserInfo) => (
            <>
              {record.phoneNumber}
            </>
          )}
        />
        <Column
          title='Job title'
          key='jobTitle'
          render={(_: any, record: IUserInfo) => (
            <>
              {record.jobTitle}
            </>
          )}
        />
        <Column
          title='Company'
          key='company'
          render={(_: any, record: IUserInfo) => (
            <>
              {record.company}
            </>
          )}
        />
         {eventQuestions?.map((item:any) => {
          return (
            <Column title={item.content} dataIndex={item.content} key={item.content} />
          )
        })}
        <Column
          title='Action'
          key='action'
          render={(_: any, record: IUserInfo) => (
            <Space size='middle'>
              <Popover
                content={
                  <>
                    <Button
                      onClick={() => deleteRegisteredEvent(record.id)}
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

export default UsersRegistered;
