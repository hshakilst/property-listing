import {
  CardData,
  PropertyDetailsPage,
  PropertyResponse,
  ImageData,
} from "./types";

export const mapResponseToCardData = (
  properties: PropertyResponse[] | null | undefined
): CardData[] | null => {
  if (!properties?.length) return null;
  return properties.map((property) => ({
    id: property?.externalId,
    title: property?.name,
    propertyType: property?.type,
    state: property?.state,
    source: property?.source
  }));
};

const mockImages = (type: string, id:string): ImageData[] => [
  {
    src: "https://picsum.photos/500/400?random=1"+id,
    alt: type,
  },
  {
    src: "https://picsum.photos/500/400?random=2"+id,
    alt: type,
  },
  {
    src: "https://picsum.photos/500/400?random=3"+id,
    alt: type,
  },
  {
    src: "https://picsum.photos/500/400?random=4"+id,
    alt: type,
  },
  {
    src: "https://picsum.photos/500/400?random=5"+id,
    alt: type,
  },
];

export const mapResponseToPropertyDetailsData = (
  property: PropertyResponse | null
): PropertyDetailsPage | null => {
  if (!property) return null;
  if (!property?.externalId) return null;

  return {
    mapUrl: property.mapUrl,
    images: property?.imageUrls?.length
      ? property.imageUrls.map((img) => ({ src: img, alt: property.type }))
      : mockImages(property?.type,property?.externalId),
    details: {
      name: property?.name,
      capacity: property?.capacity,
      city: property?.city,
      zip: property?.zip,
      state: property?.state,
      address: property?.address,
      county: property?.county,
      phone: property?.phone,
      type: property?.type,
      source: property?.source,
      descriptions: property?.descriptions,
      detailsUrl: property?.detailsUrl,
    },
  };
};
