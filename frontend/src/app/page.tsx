"use server";
import CardGrid from "@/components/card-grid";
import SearchBar from "@/components/search-bar";
import { sanitizeParams } from "@/lib/helper";
import { mapResponseToCardData } from "@/lib/mapper";
import { CardData, PropertyResponse } from "@/lib/types";

type HomeProps = {
  searchParams?: { [key: string]: string | undefined };
};

const Home: React.FC<HomeProps> = async ({ searchParams }) => {
  // Need Some Basic Sanitization
  const query = sanitizeParams(searchParams?.q);

  const cardsData = await getCardsData(query);

  return (
    <div className="p-10">
      <SearchBar defaultValue={query} />
      <CardGrid cardsData={cardsData} />
    </div>
  );
};

async function getCardsData(query?: string | null): Promise<CardData[] | null> {
  if (!query) return null;

  const response = await fetch(
    `${process.env.API_URL ?? "http://localhost:8080/api"}` +
      "/search?q=" +
      query
  );

  if (!response.ok) return null;

  const results: PropertyResponse[] = await response.json();

  if (!results?.length) return null;

  return mapResponseToCardData(results);
}

export default Home;
