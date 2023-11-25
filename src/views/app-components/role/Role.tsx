import { Button, Card, Row, Table } from 'antd';

import RolePopUp from './RolePopup';
import useRole from './hooks/useRole';
import useGetRoleListQuery from './hooks/queries/useGetRoleListQuery';
import { useEffect } from 'react';

const Role = () => {
  const {
    columns,
    isEdit,
    setIsEdit,
    isOpen,
    setIsOpen,
    editingRow,
    paramsWithPagination,
    setParamsWithPagination,
  } = useRole();

  const { data, loading, refetch } = useGetRoleListQuery({
    paramsWithPagination,
  });

  useEffect(() => {
    refetch();
  }, [paramsWithPagination]);

  return (
    <div>
      <Card>
        <Row justify={'end'}>
          <Button type='primary' onClick={() => setIsOpen(true)}>
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
                limit: pageSize,
              });
            },
          }}
          rowKey={(row) => row.id}
        />
      </Card>
      <RolePopUp
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editingRow={editingRow}
      />
    </div>
  );
};

export default Role;
