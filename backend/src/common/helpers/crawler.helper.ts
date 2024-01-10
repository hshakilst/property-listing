import { Logger } from '@nestjs/common';
import { gotScraping } from 'crawlee';

export class CrawlerHelper {
  private static readonly logger = new Logger(CrawlerHelper.name);

  //Create a sendRequest function using got-scraping
  static async sendRequest(
    url,
    method = 'GET',
    responseType: 'text' | 'json' = 'text',
    payload = undefined,
    headers = {},
  ) {
    try {
      const options = {
        url: url,
        method: method,
        headers: {
          ...headers,
        },
        responseType,
        json: payload,
      };

      const response = await gotScraping(options);
      return response.body;
    } catch (error) {
      CrawlerHelper.logger.error(error);
    }
  }
}
