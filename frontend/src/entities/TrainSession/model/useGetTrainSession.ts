import { TrainSessionService } from '@shared/api/services';
import { useQuery } from 'react-query';

export function useGetTrainSession() {
  return useQuery({
    keepPreviousData: true,
    queryFn: async () => {
      const { data } = await TrainSessionService.getTrainSession();
      return data;
    },
    queryKey: 'getTrainSession'
  });
}
