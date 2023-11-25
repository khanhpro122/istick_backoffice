// Redux
import { useAppDispatch } from '@/_redux/hooks';
import { getResearchsAction, researchsListSelector } from '@/_redux/features/research';

// Apis
import { IGetListResearchParam } from '@/apis/researchs';

// Types
import { ListResearch } from '@/types/research';

export default function useGetListResearch(): [
  boolean,
  ListResearch | undefined,
  (params: IGetListResearchParam) => void
] {
  const { loading, list: ListResearch } = researchsListSelector();
  const dispatch = useAppDispatch();

  const getResearchs = (params: IGetListResearchParam) => {
    dispatch(getResearchsAction(params));
  };

  const onSearch = (params: IGetListResearchParam) => {
    getResearchs(params);
  };

  return [loading, ListResearch, onSearch];
}
