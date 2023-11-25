// Redux
import { useAppDispatch } from '@/_redux/hooks';

// Types
import { ListCompany } from '@/types/company';
import { IGetListCompanyParam } from '@/apis/companies';
import { companiesListSelector, getCompaniesAction } from '@/_redux/features/company';

export default function useGetListCompany(): [
  boolean,
  ListCompany | undefined,
  (params: IGetListCompanyParam) => void
] {
  const { loading, list: ListCompany } = companiesListSelector();
  const dispatch = useAppDispatch();

  const getCompanies = (params: IGetListCompanyParam) => {
    dispatch(getCompaniesAction(params));
  };

  const onSearch = (params: IGetListCompanyParam) => {
    getCompanies(params);
  };

  return [loading, ListCompany, onSearch];
}
