import { TrainingSessionService } from '@shared/api/services';
import { useQuery } from 'react-query';

export function useGetTrainingSession() {
  return useQuery({
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await TrainingSessionService.getTrainingSession();
      return data;
    },
    queryKey: 'getTrainSession'
  });
}
