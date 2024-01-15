import { CardData } from "@/lib/types";
import Card from "./card";

type CardGridProps = {
  cardsData: CardData[] | null;
};

const CardGrid: React.FC<CardGridProps> = ({ cardsData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 pt-10">
      {cardsData?.length &&
        cardsData.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            title={card.title}
            propertyType={card.propertyType}
            state={card.state}
          />
        ))}
    </div>
  );
};

export default CardGrid;
