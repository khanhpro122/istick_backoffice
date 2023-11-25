import { useQuery } from '@tanstack/react-query';
import { apiGetPermissionList } from '../../../../../apis/role';
import { IGetPermissionListResponse } from '../../../../../apis/role/types';

const useGetPermissionListQuery = () => {
  const query = useQuery<IGetPermissionListResponse>(
    ['role', 'getPermission'],
    async () => {
      const response = await apiGetPermissionList();
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

export default useGetPermissionListQuery;
