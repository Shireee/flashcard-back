import { ImageService } from '@shared/api/services';
import { useQuery } from 'react-query';

export function useGetImages(word: string) {
  return useQuery({
    keepPreviousData: true,
    queryFn: async () => {
      const synonyms = await ImageService.getImages(word);
      return synonyms;
    },
    queryKey: ['getSynonyms', word],
    enabled: !!word
  });
}
