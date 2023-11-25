import { useQuery } from '@tanstack/react-query';
import { apiGetRoleList } from '../../../../../apis/role';
import { IGetRoleListResponse } from '../../../../../apis/role/types';
import { useLocation } from 'react-router-dom';
import { IParamsPagination } from '../../../../../utils/paginationTableAntd';

interface Props {
  paramsWithPagination: IParamsPagination;
}

const useGetRoleListQuery = ({ paramsWithPagination }: Props) => {
  const location = useLocation();

  const query = useQuery<IGetRoleListResponse>(
    ['role', 'getRole', location.key],
    async () => {
      const response = await apiGetRoleList({
        limit: paramsWithPagination.limit,
        page: paramsWithPagination.page,
        isTotal: true,
      });

      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: true,
    }
  );

  const loading = Boolean(query.isInitialLoading || query.isRefetching);

  return { ...query, loading };
};

export default useGetRoleListQuery;
