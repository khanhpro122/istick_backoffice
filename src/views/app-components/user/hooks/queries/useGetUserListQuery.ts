import { useQuery } from '@tanstack/react-query';
import { apiGetUserList } from '../../../../../apis/user';
import { IGetUserResponse } from '../../../../../apis/user/types';
import { IParamsPagination } from '../../../../../utils/paginationTableAntd';

interface Props {
  paramsWithPagination: IParamsPagination;
}

const useGetUserListQuery = ({ paramsWithPagination }: Props) => {
  const query = useQuery<IGetUserResponse>(
    ['user', 'getUser'],
    async () => {
      const response = await apiGetUserList({
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

export default useGetUserListQuery;
