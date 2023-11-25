import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import useGetRoleFullListQuery from './hooks/queries/useGetRoleFullListQuery';
import { DataType } from './hooks/useUser';
import { validateMessages } from '../../../utils/validateMessages';
import { CustomSwal } from '../../../components/custom-swal';
import queryClient from '../../../apis/queryClient';
import { showSwalSuccess } from '../../../utils/showSwalAlert';
import { apiCreateUser, apiUpdateUser } from '../../../apis/user';
import { UpperFirstLetter } from '../../../utils/upperFirstLetter';
import { UserType } from '@/types/users';

interface Props {
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  editingRow?: DataType;
}

const UserPopUp: FC<Props> = ({
  isEdit,
  setIsEdit,
  isOpen,
  setIsOpen,
  editingRow,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(editingRow);

  useEffect(() => {
    if (isEdit) {
      form.setFieldValue('username', editingRow?.username);
      form.setFieldValue('password', '********');
      form.setFieldValue('status', editingRow?.status);
      form.setFieldValue('role', editingRow?.roleId);
    }
  }, [form, isEdit, editingRow]);

  const onFinish = async () => {
    const { username, password, status, role } = form.getFieldsValue();

    if (isEdit) {
      try {
        setIsLoading(true);
        const body = {
          username: username,
          roleId: role,
          userStatus: status,
        };
        if (username) {
          const response = await apiUpdateUser(editingRow!.id, body);
          if (response.status === 200) {
            await showSwalSuccess('Edit Success');
            setIsOpen(false);
            queryClient.invalidateQueries(['user', 'getUser']);
            form.resetFields();
          }
        }
      } catch (error: any) {
        CustomSwal.fire({
          icon: 'error',
          text: UpperFirstLetter(error?.message) || 'Edit errors',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const body = {
          password: password,
          roleId: role,
          userStatus: status,
          userType: UserType.BackOffice,
          username: username,
        };
        if (username) {
          const response = await apiCreateUser(body);
          if (response.status === 200) {
            await showSwalSuccess('Create Success');
            setIsOpen(false);
            queryClient.invalidateQueries(['user', 'getUser']);
            form.resetFields();
          }
        }
      } catch (error) {
        CustomSwal.fire({
          icon: 'error',
          text: 'Create errors',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { data, loading, fetchNextPage } = useGetRoleFullListQuery();

  const onCancel = () => {
    setIsEdit(false);
    setIsOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={isEdit ? 'Edit User' : 'Create User'}
      open={isOpen}
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
        validateMessages={validateMessages}
        // initialValues={initialValues}
      >
        <Row gutter={[8, 16]}>
          <Col xs={24} md={16}>
            <Form.Item
              name='username'
              label='Username'
              rules={[
                {
                  required: isEdit ? false : true,
                  type: isEdit ? 'string' : 'email',
                },
              ]}
            >
              <Input disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item
              name='status'
              label='Status'
              rules={[{ required: true }]}
            >
              <Select placeholder='select...'>
                <Select.Option value='active'>Active</Select.Option>
                <Select.Option value='inactive'>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[8, 16]}>
          <Col xs={24} md={16}>
            <Form.Item
              name='password'
              label='Password'
              rules={[
                { required: isEdit ? false : true },
                {
                  validator: (_, value) => {
                    var regex = new RegExp(
                      /^(?=.*[0-9])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+,.\\;':"-]).{7,}$/
                    );
                    if (value) {
                      if (value.match(regex) || isEdit) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        'Minimum 8 characters, At least 1 UPPER CASE, 1 lower case, 1 symbol, 1 number'
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input.Password disabled={isEdit} />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item name='role' label='Role' rules={[{ required: true }]}>
              <Select
                placeholder='select...'
                allowClear
                loading={loading}
                onPopupScroll={(e) => {
                  const { target } = e;
                  if (
                    (target as any).scrollTop + (target as any).offsetHeight ===
                    (target as any).scrollHeight
                  ) {
                    fetchNextPage();
                  }
                }}
              >
                {data?.pages
                  .filter((e) => e.list !== null)
                  .map((group, i) => (
                    <React.Fragment key={i}>
                      {group.list.length > 0 &&
                        group.list.map((d: any) => (
                          <Select.Option key={d.id} value={d.id}>
                            {d.name}
                          </Select.Option>
                        ))}
                    </React.Fragment>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div style={{ textAlign: 'end' }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={isLoading}>
              Confirm
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default UserPopUp;
