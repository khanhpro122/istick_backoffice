import { Button, Col, Form, Input, Modal, Row, Space, Tree } from 'antd';
import { FC, useEffect, useState } from 'react';
import { CustomSwal } from '../../../components/custom-swal';
import { apiCreateRole, apiUpdateRole } from '../../../apis/role';
import queryClient from '../../../apis/queryClient';
import { showSwalSuccess } from '../../../utils/showSwalAlert';
import { DataType } from './hooks/useRole';
import useGetPermissionListQuery from './hooks/queries/useGetPermissionListQuery';
import { partitionArray } from '../../../utils/partitionArray';
import { UpperFirstLetter } from '../../../utils/upperFirstLetter';
import { DataNode } from 'antd/es/tree';
import useGetPermissionListByIdQuery from './hooks/queries/useGetPermissionListByIdQuery';
import { validateMessages } from '../../../utils/validateMessages';

interface Props {
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  editingRow?: DataType;
}

const RolePopUp: FC<Props> = ({
  isEdit,
  setIsEdit,
  isOpen,
  setIsOpen,
  editingRow,
}) => {
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['user']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const { data, isSuccess } = useGetPermissionListQuery();
  const { data: dataEdit } = useGetPermissionListByIdQuery(editingRow?.id);

  const dataTreee = isSuccess && partitionArray(data?.permissions, 'target');

  const treeData = Object.entries(dataTreee).map((entry) => {
    const [key, value] = entry;

    const children =
      Array.isArray(value) &&
      value.map((d) => {
        return {
          title: UpperFirstLetter(d.action),
          key: d.id,
        };
      });

    return {
      title: UpperFirstLetter(key),
      key: key,
      children: children,
    };
  });

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  useEffect(() => {
    if (isEdit) {
      const permissionChecked = dataEdit?.permissions.map((obj) => obj.id);
      form.setFieldValue('roleName', editingRow?.name);
      form.setFieldValue('permission', permissionChecked);
      setCheckedKeys(permissionChecked);
    } else {
      form.resetFields();
      setCheckedKeys([]);
    }
  }, [form, isEdit, editingRow, dataEdit]);

  const onFinish = async () => {
    const { roleName, permission } = form.getFieldsValue();
    const permissionAcceppted = permission?.filter(
      (e: any) => typeof e === 'number'
    );

    if (isEdit) {
      try {
        setIsLoading(true);
        const body = {
          permissionIds: permissionAcceppted,
          roleName: roleName,
        };
        if (roleName) {
          const response = await apiUpdateRole(editingRow!.id, body);
          if (response.status === 200) {
            await showSwalSuccess('Edit Success');
            setIsOpen(false);
            queryClient.invalidateQueries(['role', 'getRole']);
            queryClient.invalidateQueries(['permission', editingRow?.id]);
            form.resetFields();
          }
        }
      } catch (error) {
        CustomSwal.fire({
          icon: 'error',
          text: 'Edit errors',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const body = {
          permissionIds: permissionAcceppted,
          roleName: roleName,
        };
        if (roleName) {
          const response = await apiCreateRole(body);
          if (response.status === 200) {
            await showSwalSuccess('Create Success');
            setIsOpen(false);
            queryClient.invalidateQueries(['role', 'getRole']);
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

  const onCancel = () => {
    setIsEdit(false);
    setIsOpen(false);
    form.resetFields();
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  return (
    <Modal
      title={isEdit ? 'Edit Role' : 'Create Role'}
      open={isOpen}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      width={700}
      centered
    >
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete='off'
        colon={false}
        layout='vertical'
        validateMessages={validateMessages}
      >
        <Row gutter={[8, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name='roleName'
              label='Role Name'
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name='permission'
              label='Permission'
              trigger='onCheck'
              rules={[{ required: true }]}
            >
              <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                defaultCheckedKeys={checkedKeys}
                checkedKeys={checkedKeys}
                onCheck={onCheck as any}
                treeData={treeData as DataNode[]}
              />
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

export default RolePopUp;
