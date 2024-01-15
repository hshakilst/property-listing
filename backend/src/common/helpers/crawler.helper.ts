import { Logger } from '@nestjs/common';

export class CrawlerHelper {
  private static readonly logger = new Logger(CrawlerHelper.name);

  static extractCapacityForHhsTexasGov(str: string): number {
    const regex = /(?:Count:|Capacity:)\s*(\d+)/;
    const matches = str.match(regex);
    return matches ? Number(matches[1]) : null;
  }

  static handleMapUrlForHhsTexasGov(mapUrl: string): string {
    if (!mapUrl) return '';

    const fragmented = mapUrl.split('/');
    const lastFragment = fragmented[fragmented.length - 1];

    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBZF8RwjhXobKAGSfq5ZEpVMdGkVRROGZA&q=${lastFragment}`;
  }
}
