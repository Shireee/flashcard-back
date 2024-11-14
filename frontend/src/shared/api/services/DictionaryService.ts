import { thirdPartyHTTPClient } from '@shared/api';
import { DictionaryModel } from '../models/dictionary';

const LANG_PAIR = 'en-ru';

export const DictionaryService = {
  getDictionary: async (word: string): Promise<string[]> => {
    try {
      // Send request to the API with the word and parameters
      const response = await thirdPartyHTTPClient.get<DictionaryModel>(
        'https://dictionary.yandex.net/api/v1/dicservice.json/lookup',
        {
          params: {
            key: `dict.1.1.20231123T220544Z.1f195b742ed11ead.0c3b1ec28970bbd60676daed6eb4836c8b7d4dcc`,
            lang: LANG_PAIR,
            text: word
          }
        }
      );

      // Validate that the response contains expected data
      if (!response.data || !response.data.def) {
        throw new Error('Invalid dictionary response');
      }

      // Extract synonyms from the response
      const synonyms: string[] = response.data.def.flatMap((definition) => {
        return (
          definition.tr?.flatMap((translation) => {
            // If synonyms exist, return them; otherwise, return an empty array
            return translation.syn?.map((synonym) => synonym.text) || [];
          }) || []
        ); // If no translations, return an empty array
      });

      return synonyms;
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
      throw new Error('Failed to fetch dictionary data');
    }
  }
};
