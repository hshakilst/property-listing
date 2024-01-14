type DetailsData = {
  name: string;
  address: string;
  phone: string;
  type: string;
  description: string;
};

type DetailsSectionProps = {
  data: DetailsData;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold">{data.name}</h2>
      <p className="text-xl">{data.phone}</p>
      <p className="text-xl">{data.address}</p>
      <p className="text-xl">{data.type}</p>
      <p className="text-xl">{data.description}</p>
    </div>
  );
};
export default DetailsSection;
