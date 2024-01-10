import { Property } from './../../../common/types/property.type';
import { Injectable, Logger } from '@nestjs/common';
import { CheerioCrawler, gotScraping, RequestList } from 'crawlee';

@Injectable()
export class HHSTexasGovSource {
  // Define the URL Schemes
  private readonly baseUrl = 'https://apps.hhs.texas.gov/LTCSearch';
  private readonly nameSearchUrl =
    'https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm';
  private readonly providerSearchUrl =
    'https://apps.hhs.texas.gov/LTCSearch/providersearch.cfm';
  private readonly providerDetailsUrl =
    'https://apps.hhs.texas.gov/LTCSearch/providerdetail.cfm';
  private readonly allNamesUrl =
    'https://apps.hhs.texas.gov/LTCSearch/namelookup.cfm?term=';
  private readonly allPlacesUrl =
    'https://apps.hhs.texas.gov/LTCSearch/placelookup.cfm?term=';

  // Define the params for searches
  private readonly nameSearchParams = {
    searchterm: '', // name
    factype: 'all,all',
  };

  private readonly fTypeParams = [
    'ALF,all',
    'DAHS,all',
    'Nursing,all',
    'Nursing,hospital',
    'hospice,all',
    'ICF,all',
    'hh,all',
    'PPECC,all',
  ];
  private readonly providerSearchParams = {
    locsearch: '', // city, county or zip
    ftype: '',
  };

  private readonly logger = new Logger(HHSTexasGovSource.name);

  private readonly results: Property[] = [];

  private async handleRequest({ request, $ }): Promise<void> {
    try {
      // Iterate over each row in the table body
      $('table.sortabletable tbody tr').each((index, element) => {
        // Extract the provider name and href
        const providerLink = $(element).find('td').eq(0).find('a');
        const name = providerLink.text().trim();
        const detailsUrl = providerLink.attr('href');
        const externalId = detailsUrl.split('=')[1].split('&')[0];

        // Extract other data from each column
        const address = $(element).find('td').eq(1).text().trim();
        const city = $(element).find('td').eq(2).text().trim();
        const zip = $(element).find('td').eq(3).text().trim();
        const county = $(element).find('td').eq(4).text().trim();
        const type = $(element).find('td').eq(5).text().trim();
        const sourceUrl = request.url;

        // Push the extracted data to the array
        this.results.push({
          externalId,
          name,
          type,
          detailsUrl,
          address,
          city,
          zip,
          county,
          state: 'Texas',
          source: 'hhs.texas.gov',
          sourceUrl,
        });
        this.logger.debug(
          externalId,
          name,
          detailsUrl,
          address,
          city,
          zip,
          county,
          type,
          sourceUrl,
        );
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async failedRequest({ request, error }): Promise<void> {
    this.logger.error(
      `The request to "${request.url}" failed with error: ${error}`,
    );
  }

  // Create List of URLs of Property Details
  private async createRequestListOfPropertyNameSearchUrls(): Promise<RequestList> {
    try {
      this.logger.debug('HHSTexasGovSource.createListOfPropertyDetailsUrls()');
      const propertyNames = await this.getAllPropertyNames();
      this.logger.debug(propertyNames.length);
      const requestList = await RequestList.open(
        'propertyNames',
        propertyNames.map((name) => ({
          useExtendedUniqueKey: true,
          url: this.nameSearchUrl,
          method: 'POST',
          payload: `searchterm=${name}&factype=all%2Call`,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          retryCount: 3,
        })),
      );
      this.logger.debug(requestList.length());
      return requestList;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Get All the Property Names To Search
  private async getAllPropertyNames(): Promise<string[]> {
    try {
      this.logger.debug('HHSTexasGovSource.init()');
      const propertyNames = new Set<string>();
      const response = await gotScraping({
        url: this.allNamesUrl,
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'json',
      });

      const names: string[] = response?.body as string[];

      if (names?.length === 0) {
        this.logger.error('No property names found');
        throw new Error('No property names found');
      }

      names.forEach((name) => {
        if (
          ['LLC', 'INC', ' LLC.', ' INC.', 'CORP', ' CORP.'].includes(name) ===
          false
        )
          propertyNames.add(name);
      });
      this.logger.debug(propertyNames.size);
      return Array.from(propertyNames);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async crawl(): Promise<Property[]> {
    try {
      const requestList =
        await this.createRequestListOfPropertyNameSearchUrls();

      console.log(requestList.length());

      const crawler = new CheerioCrawler({
        requestList,
        requestHandler: this.handleRequest.bind(this),
        failedRequestHandler: this.failedRequest.bind(this),
        requestHandlerTimeoutSecs: 60,
        maxRequestRetries: 3,
      });

      this.logger.debug('HHSTexasGovSource.crawl()');

      process.on('SIGINT', () => this.gracefulShutdown(crawler));

      await crawler.run();

      return this.results;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Gracefully shutdown the crawler
  async gracefulShutdown(crawler: CheerioCrawler) {
    console.log('Shutting down gracefully...');
    try {
      await crawler.teardown();
      console.log('Crawler stopped.');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}
