import { useQuery } from '@tanstack/react-query';
import { apiGetPermissionList } from '../../../../../apis/role';
import { IGetPermissionListResponse } from '../../../../../apis/role/types';

const useGetPermissionListByIdQuery = (id?: number) => {
  const query = useQuery<IGetPermissionListResponse>(
    ['permission', id],
    async ({ queryKey }) => {
      const response = await apiGetPermissionList(queryKey[1] as number);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const loading = Boolean(query.isInitialLoading || query.isRefetching);

  return { ...query, loading };
};

export default useGetPermissionListByIdQuery;
