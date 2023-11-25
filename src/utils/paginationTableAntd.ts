
export interface IParamsPagination {
  page: number;
  limit: number;
}


export const paginationTable = (
  total: number | undefined,
  page: number,
  limit: number
) => {
  return {
    current: page,
    showSizeChanger: true,
    defaultPageSize: limit || 5,
    pageSizeOptions: ['5', '10', '20', '50'],
    total,
    showTotal: () => `Total ${total}`,
  };
};
