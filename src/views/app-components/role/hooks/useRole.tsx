import { EditTwoTone } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { IParamsPagination } from '../../../../utils/paginationTableAntd';
import { DATETIME } from '../../../../utils/common';

export interface DataType {
  id: number;
  name: string;
  updatedBy: string;
}

const useRole = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<DataType>();
  const [paramsWithPagination, setParamsWithPagination] =
    useState<IParamsPagination>({
      page: 1,
      limit: 10,
    });

  const columns: ColumnsType<DataType> = [
    {
      title: 'Role name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: (value) => dayjs(value).format(DATETIME),
    },
    {
      title: 'Last Operator',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
      align: 'center',
    },
    {
      title: 'Operation',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (_, value) => (
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
  };
};

export default useRole;
