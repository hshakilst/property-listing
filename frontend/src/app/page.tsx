"use client";
import { useState } from "react";
import CardGrid from "@/components/card-grid";
import SearchBar from "@/components/search-bar";

const Home: React.FC = () => {
  const [cardData, setCardData] = useState({
    cardsData: [
      {
        id: 1,
        title: "Card 1",
        content: "This is the content for card 1",
      },
      {
        id: 2,
        title: "Card 2",
        content: "This is the content for card 2",
      },
      {
        id: 3,
        title: "Card 3",
        content: "This is the content for card 3",
      },
      {
        id: 4,
        title: "Card 4",
        content: "This is the content for card 4",
      },
      {
        id: 5,
        title: "Card 5",
        content: "This is the content for card 5",
      },
      {
        id: 6,
        title: "Card 6",
        content: "This is the content for card 6",
      },
      {
        id: 7,
        title: "Card 7",
        content: "This is the content for card 7",
      },
      {
        id: 8,
        title: "Card 8",
        content: "This is the content for card 8",
      },
      {
        id: 9,
        title: "Card 9",
        content: "This is the content for card 9",
      },
      {
        id: 10,
        title: "Card 10",
        content: "This is the content for card 10",
      },
      {
        id: 11,
        title: "Card 11",
        content: "This is the content for card 11",
      },
      {
        id: 12,
        title: "Card 12",
        content: "This is the content for card 12",
      },
    ],
  });

  return (
    <div className="p-10">
      <SearchBar />
      <CardGrid {...cardData} />
    </div>
  );
};

export default Home;
