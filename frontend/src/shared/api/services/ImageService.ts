import { thirdPartyHTTPClient } from '../httpClients';

const CLIENT_ID = 'flrfcq3Frm3NV2oS0KlGZ4FHCsTytmyFn9Ra1ZWEJBI';
const RESPONSE_LENGTH = 12;

export const ImageService = {
  getImage: async (word: string): Promise<string[]> => {
    try {
      const response = await thirdPartyHTTPClient.get<{ results: { urls: { small: string } }[] }>(
        'https://api.unsplash.com/search/photos',
        {
          params: {
            client_id: CLIENT_ID,
            query: word,
            per_page: RESPONSE_LENGTH
          }
        }
      );

      const imageUrls = response.data.results.map((item) => item.urls.small);

      return imageUrls;
    } catch (error) {
      console.error('Ошибка при получении изображений:', error);
      throw new Error('Не удалось получить изображения');
    }
  }
};
