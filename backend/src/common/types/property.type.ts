export type PropertySource = 'hhs.texas.gov' | 'healthfinder.fl.gov';

export const PropertySourceEnum = ['hhs.texas.gov', 'healthfinder.fl.gov'];

export interface Property {
  externalId: string;
  name: string;
  city: string;
  zip: string;
  state: string;
  imageUrls?: string[];
  address: string;
  county: string;
  phone?: string;
  type: string;
  capacity?: number;
  source: PropertySource;
  sourceUrl: string;
  detailsUrl: string;
  mapUrl?: string;
}
