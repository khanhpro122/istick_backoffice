import { useInfiniteQuery } from '@tanstack/react-query';
import { apiGetRoleList } from '../../../../../apis/role';
import { IGetRoleListResponse } from '../../../../../apis/role/types';

const useGetRoleFullListQuery = () => {
  const LIMIT = 50;

  const query = useInfiniteQuery<IGetRoleListResponse>(
    ['full_role'],
    async ({ pageParam = 1 }) => {
      const response = await apiGetRoleList({
        limit: LIMIT,
        page: pageParam,
        isTotal: true,
      });

      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + 1;
        return lastPage.list.length < LIMIT ? undefined : nextPage;
      },
    }
  );

  const loading = Boolean(query.isInitialLoading || query.isRefetching);

  return { ...query, loading };
};

export default useGetRoleFullListQuery;
