export type PropertySource = 'hhs.texas.gov' | 'healthfinder.fl.gov';

export const PropertySourceEnum = ['hhs.texas.gov', 'healthfinder.fl.gov'];

export interface Property {
  externalId: string;
  name: string;
  capacity?: number;
  city: string;
  zip: string;
  state: string;
  imageUrls?: string[];
  address: string;
  county: string;
  phone?: string;
  type: string;
  source: PropertySource;
  sourceUrl?: string;
  detailsUrl?: string;
  mapUrl?: string;
  descriptions?: string[];
}
