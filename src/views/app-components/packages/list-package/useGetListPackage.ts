import { useAppDispatch } from '@/_redux/hooks';
import { getPackagesAction, packagesListSelector } from '@/_redux/features/package';
import { ListPackage } from '@/types/package';
import { IGetListPackageParam } from '@/apis/packages';

export default function useGetListPackage(): [
  boolean,
  ListPackage | undefined,
  (params: IGetListPackageParam) => void
] {
  const { loading, list: listPackage } = packagesListSelector();
  const dispatch = useAppDispatch();

  const getPackages = (params: IGetListPackageParam) => {
    dispatch(getPackagesAction(params));
  };

  const onSearch = (params: IGetListPackageParam) => {
    getPackages(params);
  };

  return [loading, listPackage, onSearch];
}
