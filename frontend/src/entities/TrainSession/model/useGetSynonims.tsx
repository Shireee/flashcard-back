import { DictionaryService } from '@shared/api/services/DictionaryService';
import { useQuery } from 'react-query';

export function useGetSynonyms(word: string) {
  return useQuery({
    keepPreviousData: true,
    queryFn: async () => {
      const synonyms = await DictionaryService.getDictionary(word);
      return synonyms;
    },
    queryKey: ['getSynonyms', word],
    enabled: !!word
  });
}
