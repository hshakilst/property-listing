import Carousel from "@/components/carousel";
import DetailsSection from "@/components/details-section";
import FileUpload from "@/components/file-upload";
import GoogleMap from "@/components/google-map";
import { sanitizeParams } from "@/lib/helper";
import { mapResponseToPropertyDetailsData } from "@/lib/mapper";
import { PropertyDetailsPage, PropertyResponse } from "@/lib/types";
import { redirect } from "next/navigation";

type PropertyDetailsProps = {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
};

const PropertyDetails: React.FC<PropertyDetailsProps> = async ({
  params,
  searchParams,
}: PropertyDetailsProps) => {
  const id = sanitizeParams(params?.id);
  const type = sanitizeParams(searchParams?.type);
  const source = sanitizeParams(searchParams?.source);

  const data = await getPropertyDetailsPageData(id, type, source);

  if (data === null || data === undefined) redirect("/");

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <div className="p-4 border border-gray-200 rounded-lg">
            <Carousel images={data?.images} />
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="p-4 border border-gray-200 rounded-lg">
            <DetailsSection data={data?.details} />
          </div>
        </div>

        <div className="md:col-span-1 inline-flex justify-center">
          <div className="p-4 border border-gray-200 rounded-lg ">
            <FileUpload id={id} type={type} source={source} />
          </div>
        </div>

        <div className="md:col-span-2 flex justify-center items-center gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <GoogleMap src={data?.mapUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

async function getPropertyDetailsPageData(
  id: string | null,
  type: string | null,
  source: string | null
): Promise<PropertyDetailsPage | null> {
  if (!id) return null;
  if (!type) return null;
  if (!source) return null;

  const response = await fetch(
    `${process.env.API_URL}` + `/property/${id}?type=${type}&source=${source}`,
    { cache: "no-cache" }
  );

  if (!response?.ok) return null;

  const result: PropertyResponse = await response.json();

  return mapResponseToPropertyDetailsData(result);
}

export default PropertyDetails;
