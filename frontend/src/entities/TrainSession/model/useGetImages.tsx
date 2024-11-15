import { ImageService } from '@shared/api/services';
import { useQuery } from 'react-query';

export function useGetImages(word: string) {
  return useQuery({
    keepPreviousData: true,
    queryFn: async () => {
      const images = await ImageService.getImages(word);
      return images;
    },
    queryKey: ['getSynonyms', word],
    enabled: !!word
  });
}
