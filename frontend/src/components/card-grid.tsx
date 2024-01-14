import Card from "./card";

type CardData = {
  id: number;
  title: string;
  content: string;
};

type CardGridProps = {
  cardsData: CardData[];
};

const CardGrid: React.FC<CardGridProps> = ({
  cardsData,
}: {
  cardsData: CardData[];
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 pt-10">
      {cardsData.map((card) => (
        <Card key={card.id} title={card.title} content={card.content} />
      ))}
    </div>
  );
};

export default CardGrid;
