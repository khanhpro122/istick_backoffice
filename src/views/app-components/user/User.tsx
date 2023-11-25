import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, notification } from 'antd'

import UserPopUp from './UserPopup'
import useUser from './hooks/useUser'
import useGetUserListQuery from './hooks/queries/useGetUserListQuery'
import { useEffect, useState } from 'react'
import { fetchPackages, updateQuantityPackage } from '@/apis/packages'
import { useTranslation } from 'react-i18next'

const User = () => {
  const { 
    columns, 
    isEdit, 
    setIsEdit, 
    isOpen, 
    setIsOpen, 
    editingRow, 
    paramsWithPagination, 
    setParamsWithPagination, 
    isOpenModalPackage, 
    setIsOpenModalPackage 
  } = useUser()

  const { data, loading, refetch } = useGetUserListQuery({ paramsWithPagination })
  const [form] = Form.useForm();
  const [optionPacks, setOptionPacks] = useState<{label: string, value: string | number}[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    refetch()
  }, [paramsWithPagination])

  const fetchAllPackages = async () => {
    await fetchPackages({limit: 50, page: 1, searchKey: ""}).then((res) => {
      setOptionPacks(res.list?.map((item) => {
        return {
          label: item?.name,
          value: item?.id
        }
      }))
    })
  }

  useEffect(() => {
    fetchAllPackages()
  }, [])

  const onCancel = () => {
    setIsOpenModalPackage({
      isOpen: false,
      idUser: ""
    })
  }

  const onFinish = async () => {
    const { quantity, packId } = form.getFieldsValue();
    if(isOpenModalPackage.idUser && packId) {
      await updateQuantityPackage({
        packId,
        quantity,
        userId: +isOpenModalPackage.idUser
      }).then((res) => {
        if (res.status) {
          notification.success({
            message: t("Update package"),
            description: t('Successful'),
          });
        }
      })
      .catch((err) => {
        notification.error({
          message: t("Update package"),
          description: t('Something went wrong'),
        });
      });
    }

  };

  return (
    <div>
      <Modal
        title="Update quantity package"
        open={isOpenModalPackage.isOpen}
        onCancel={onCancel}
        footer={null}
        maskClosable={false}
        centered
      >
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete='off'
          colon={false}
          layout='vertical'
          // initialValues={initialValues}
        >
          <Row>
            <Col xs={24} md={16}>
              <Form.Item
                name='quantity'
                label='Quantity'
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input placeholder='Enter quantity package'/>
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item
                name='packId'
                label='Select package'
                rules={[
                  {
                    required: true,
                  },
                ]}
              > 
                <Select placeholder='Selected package' options={optionPacks} />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ textAlign: 'end' }}>
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type='primary' htmlType='submit'>
                Confirm
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
      <Card>
        <Row justify={'end'}>
          <Button type="primary" onClick={() => setIsOpen(true)}>
            Create
          </Button>
        </Row>
      </Card>
      <br />
      <Card>
        <Table
          columns={columns}
          dataSource={data?.list ?? []}
          loading={loading}
          pagination={{
            current: paramsWithPagination.page,
            showSizeChanger: true,
            defaultPageSize: paramsWithPagination.limit || 5,
            pageSizeOptions: ['5', '10', '20', '50'],
            total: data?.total,
            showTotal: () => `Total ${data?.total}`,
            onChange: (page, pageSize) => {
              setParamsWithPagination({
                ...paramsWithPagination,
                page: page,
                limit: pageSize
              })
            }
          }}
          rowKey={(row) => row.id} />
      </Card>
      <UserPopUp isEdit={isEdit} setIsEdit={setIsEdit} isOpen={isOpen} setIsOpen={setIsOpen} editingRow={editingRow} />
    </div>
  )
}

export default User
