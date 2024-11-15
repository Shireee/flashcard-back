import { TrainingSessionService } from '@shared/api/services';
import { useMutation, useQueryClient } from 'react-query';

export function useUpdateRepeatNumber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await TrainingSessionService.updateRepeatNumber(id);
      return data;
    },
    onSuccess: (updatedCard) => {
      queryClient.setQueryData('getTrainSession', (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((card: any) => (card.id === updatedCard.id ? updatedCard : card));
      });
    },
    onError: (error) => {
      console.error('Error updating repeatNumber:', error);
    }
  });
}
