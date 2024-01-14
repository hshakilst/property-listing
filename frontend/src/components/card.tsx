type CardProps = {
  title: string;
  content: string;
};

const Card: React.FC<CardProps> = ({ title, content }) => {
  return (
    <div className="bg-gray-800 text-white p-4 shadow-md mb-4 rounded-md">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300">{content}</p>
    </div>
  );
};

export default Card;
