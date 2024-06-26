import { CrawlerHelper } from './../../../common/helpers/crawler.helper';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CheerioCrawler, gotScraping, RequestList } from 'crawlee';
import { Model } from 'mongoose';
import { PropertyModel } from '../../../common/models/property.model';

@Injectable()
export class HHSTexasGovSource {
  constructor(
    @InjectModel(PropertyModel.name)
    private readonly propertyModel: Model<PropertyModel>,
  ) {}
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

  // Define the crawler and handlers
  private crawler: CheerioCrawler;

  private async handleSearchRequest({ request, $ }): Promise<void> {
    try {
      // Iterate over each row in the table body
      $('table.sortabletable tbody tr').each(async (index, element) => {
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

        await this.propertyModel.updateOne(
          { externalId, source: 'hhs.texas.gov', detailsUrl },
          {
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
          },
          { upsert: true },
        );
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async handleDetailsPageRequest({ request, $ }): Promise<void> {
    try {
      const externalId = request.url.split('=')[1].split('&')[0];
      const phoneText = $('i.fa-phone').parent().text().trim();
      const phoneMatch = phoneText.match(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/);
      const phone = phoneMatch ? phoneMatch[0] : 'N/A';
      const mapUrl = $('i.fa-map-marker').parent().find('a').attr('href');
      let capacity = 0;

      const descriptions = [];
      $("h2:contains('Description')")
        .next('ul')
        .find('li')
        .each(function () {
          if (
            $(this).text().trim().includes('Capacity') ||
            $(this).text().trim().includes('Count')
          )
            capacity = CrawlerHelper.extractCapacityForHhsTexasGov(
              $(this).text().trim(),
            );
          descriptions.push($(this).text().trim());
        });

      await this.propertyModel.updateOne(
        {
          externalId,
          source: 'hhs.texas.gov',
          detailsUrl: decodeURI(
            String(request.url).replace(this.baseUrl + '/', ''),
          ),
        },
        { phone, descriptions, mapUrl, capacity },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async failedRequest({ request, error }): Promise<void> {
    this.logger.error(
      `The request to "${request.url}" failed with error: ${error}`,
    );
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
        // if (
        //   ['LLC', 'INC', ' LLC.', ' INC.', 'CORP', ' CORP.'].includes(name) ===
        //   false
        // )
        propertyNames.add(name);
      });
      this.logger.debug('Total Property Names: ', propertyNames.size);
      return Array.from(propertyNames);
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Create A Request List For Searching By Name
  private async createRequestListOfPropertyNameSearchUrls(): Promise<RequestList> {
    try {
      this.logger.debug('HHSTexasGovSource.createListOfPropertyDetailsUrls()');

      const propertyNames = await this.getAllPropertyNames();

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
        })),
      );

      this.logger.debug('Total Property Search URLs: ', requestList.length());

      return requestList;
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Create A Request List For Property Details
  private async createRequestListOfPropertyDetailsUrls(): Promise<RequestList> {
    try {
      this.logger.debug('HHSTexasGovSource.createListOfPropertyDetailsUrls()');

      const propertyDetailsUrls = await this.propertyModel
        .find({ source: 'hhs.texas.gov' }, { detailsUrl: 1, _id: 0 })
        .lean()
        .exec();

      this.logger.debug(propertyDetailsUrls.length);

      const requestList = await RequestList.open(
        'propertyDetails',
        propertyDetailsUrls.map((url) => ({
          useExtendedUniqueKey: true,
          url: this.baseUrl + '/' + url.detailsUrl,
          method: 'GET',
        })),
      );

      this.logger.debug('Total Property Details URLs', requestList.length());

      return requestList;
    } catch (error) {
      this.logger.error(error);
    }
  }

  async crawlSearchResult(): Promise<void> {
    try {
      const requestList =
        await this.createRequestListOfPropertyNameSearchUrls();

      this.logger.debug(requestList.length());

      this.crawler = new CheerioCrawler({
        requestList,
        requestHandler: this.handleSearchRequest.bind(this),
        failedRequestHandler: this.failedRequest.bind(this),
        requestHandlerTimeoutSecs: 120,
        maxRequestRetries: 5,
        navigationTimeoutSecs: 120,
        // maxRequestsPerMinute: 60,//average: 1000+ requests per minute
      });

      this.logger.debug('HHSTexasGovSource.crawl()');

      process.on('SIGINT', () => this.gracefulShutdown());

      await this.crawler.run();
    } catch (error) {
      this.logger.error(error);
    }
  }

  async crawlDetailsPage(): Promise<void> {
    try {
      const requestList = await this.createRequestListOfPropertyDetailsUrls();

      this.logger.debug(requestList.length());

      this.crawler = new CheerioCrawler({
        requestList,
        requestHandler: this.handleDetailsPageRequest.bind(this),
        failedRequestHandler: this.failedRequest.bind(this),
        requestHandlerTimeoutSecs: 120,
        maxRequestRetries: 5,
        navigationTimeoutSecs: 60,
        // maxRequestsPerMinute: 60, //average: 1000+ requests per minute
      });

      this.logger.debug('HHSTexasGovSource.crawlDetailsPage()');

      process.on('SIGINT', () => this.gracefulShutdown());
      await this.crawler.run();
    } catch (error) {
      this.logger.error(error);
    }
  }

  // Gracefully shutdown the crawler
  async gracefulShutdown() {
    this.logger.debug('Shutting down gracefully...');
    try {
      await this.crawler.autoscaledPool.pause();
      await this.crawler.autoscaledPool.abort();
      await this.crawler.teardown();
      this.logger.debug('Crawler stopped.');
      // if (process.env.NODE_ENV === 'local') process.exit(0);
    } catch (error) {
      this.logger.error('Error while shutting down the crawler.', error);
      // if (process.env.NODE_ENV === 'local') process.exit(1);
    }
  }

  isCrawlerRunning(): boolean {
    try {
      return this.crawler?.running ?? false;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
