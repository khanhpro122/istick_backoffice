import { EditTwoTone, ArrowUpOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IParamsPagination } from '../../../../utils/paginationTableAntd';
import { UpperFirstLetter } from '../../../../utils/upperFirstLetter';
import { DATETIME } from '../../../../utils/common';

export interface DataType {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  status: string;
  updatedAt: string;
}

const useUser = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModalPackage, setIsOpenModalPackage] = useState<{isOpen: boolean, idUser: string | number}>({
    isOpen: false,
    idUser: ""
  });
  const [editingRow, setEditingRow] = useState<DataType>();
  const [paramsWithPagination, setParamsWithPagination] =
    useState<IParamsPagination>({
      page: 1,
      limit: 10,
    });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value) => <div>{UpperFirstLetter(value)}</div>,
    },
    {
      title: 'Update By',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: (value) => dayjs(value).format(DATETIME),
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (_, value) => (
        <div style={{display: "flex", gap: "10px"}}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsOpen(true);
              setIsEdit(true);
              setEditingRow(value);
            }}
          >
            <EditTwoTone />
          </span>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setIsOpenModalPackage({
                isOpen: true,
                idUser: value.id
              });
            }}
          >
            Update pack
          </span>
        </div>
       
      ),
    },
  ];

  return {
    columns,
    isEdit,
    setIsEdit,
    isOpen,
    setIsOpen,
    editingRow,
    paramsWithPagination,
    setParamsWithPagination,
    setIsOpenModalPackage,
    isOpenModalPackage
  };
};

export default useUser;
