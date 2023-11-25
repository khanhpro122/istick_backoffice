// Redux
import { useAppDispatch } from '@/_redux/hooks';

// Apis
import { IGetListResearchParam } from '@/apis/researchs';

// Types
import { ListJob } from '@/types/jobs';
import { IGetListJobParam } from '@/apis/jobs';
import { getJobsAction, jobsListSelector } from '@/_redux/features/job';

export default function useGetListJob(): [
  boolean,
  ListJob | undefined,
  (params: IGetListJobParam) => void
] {
  const { loading, list: ListJob } = jobsListSelector();
  const dispatch = useAppDispatch();

  const getJobs = (params: IGetListResearchParam) => {
    dispatch(getJobsAction(params));
  };

  const onSearch = (params: IGetListResearchParam) => {
    getJobs(params);
  };

  return [loading, ListJob, onSearch];
}
