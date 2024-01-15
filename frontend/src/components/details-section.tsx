import { PropertyDetailsData } from "@/lib/types";

type DetailsSectionProps = {
  data: PropertyDetailsData;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold">Name: {data.name}</h2>
      <p className="text-xl">Total Capacity: {data.capacity}</p>
      <p className="text-xl">
        Address:{" "}
        {`${data.address}, ${data.city}, ${data.zip}, ${data.county}, ${data.state}`}
      </p>
      <p className="text-xl">Phone: {data.phone}</p>
      <p className="text-xl">Facility: {data.type}</p>
      <p className="text-xl">
        Descriptions:
        <ul>
          {data.descriptions?.length &&
            data.descriptions?.map((description) => <li>{description}</li>)}
        </ul>
      </p>
      <p className="text-xl">Source: {data.source}</p>
      <p className="text-xl py-1">
        <a
          className="link link-accent"
          href="https://example.com"
          target="_blank"
        >
          Visit the Property on Source's Website
        </a>
      </p>
    </div>
  );
};
export default DetailsSection;
