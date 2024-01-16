export type CardData = {
  id: string;
  title: string;
  propertyType: string;
  state: string;
  source: string;
};

export type ImageData = {
  src: string;
  alt: string;
};

export type PropertyDetailsPage = {
  details: PropertyDetailsData
  mapUrl: string;
  images: ImageData[];
}

export type PropertyDetailsData = {
  name: string;
  capacity: number;
  city: string;
  zip: string;
  state: string;
  address: string;
  county: string;
  phone: string;
  type: string;
  source: PropertySource;
  descriptions:string[];
  detailsUrl: string;
};

export type PropertySource = 'hhs.texas.gov' | 'healthfinder.fl.gov';

export type PropertyResponse = {
  externalId: string;
  name: string;
  capacity: number;
  city: string;
  zip: string;
  state: string;
  imageUrls: string[];
  address: string;
  county: string;
  phone: string;
  type: string;
  source: PropertySource;
  mapUrl: string;
  descriptions: string[];
  detailsUrl: string;
}