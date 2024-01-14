import { Logger } from '@nestjs/common';

export class CrawlerHelper {
  private static readonly logger = new Logger(CrawlerHelper.name);

  static extractCapacityForHhsTexasGov(str: string): number {
    const regex = /(?:Count:|Capacity:)\s*(\d+)/;
    const matches = str.match(regex);
    return matches ? Number(matches[1]) : null;
  }
}
