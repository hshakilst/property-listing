import { CardData, PropertyResponse } from "./types";

export const mapResponseToCardData = (
  properties: PropertyResponse[]
): CardData[] | null => {
  if (!properties?.length) return null;
  return properties.map((property) => ({
    id: property?.externalId,
    title: property?.name,
    propertyType: property?.type,
    state: property.state,
  }));
};
