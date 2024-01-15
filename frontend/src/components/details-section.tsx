import { PropertyDetailsData } from "@/lib/types";

type DetailsSectionProps = {
  data: PropertyDetailsData;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({ data }) => {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold">{data.name}</h2>
      <div className="p-4">
        <p className="text-xl p-1">Total Capacity: {data.capacity}</p>
        <p className="text-xl p-1">
          Address:{" "}
          {`${data.address}, ${data.city}, ${data.zip}, ${data.county}, ${data.state}`}
        </p>
        <p className="text-xl p-1">Phone: {data.phone}</p>
        <p className="text-xl p-1">Facility: {data.type}</p>
        <p className="text-xl p-1">Descriptions:</p>
        <ul className="list-disc px-8">
          {data.descriptions?.length &&
            data.descriptions?.map((description, index) => (
              <li className="text-base" key={index}>
                {description}
              </li>
            ))}
        </ul>
        <p className="text-xl p-1">Source: {data?.source}</p>
      </div>
      <p className="text-xl py-1">
        <a className="link link-accent" href={data?.detailsUrl} target="_blank">
          Visit the Property on Source's Website
        </a>
      </p>
    </div>
  );
};
export default DetailsSection;
