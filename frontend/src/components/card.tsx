"use client";
import { useRouter } from "next/navigation";

type CardProps = {
  id: string;
  title: string;
  propertyType: string;
  state: string;
};

const Card: React.FC<CardProps> = ({ id, title, propertyType, state }) => {
  const router = useRouter();
  return (
    <div
      className="bg-gray-800 text-white p-4 shadow-md mb-4 rounded-md"
      role="button"
      onClick={() => {
        router.push(`/properties/${id}?type=${propertyType}&state=${state}`);
      }}
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-300">{propertyType}</p>
      <p className="text-gray-300">{state}</p>
    </div>
  );
};

export default Card;
