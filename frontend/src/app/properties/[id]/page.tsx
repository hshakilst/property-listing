import Carousel from "@/components/carousel";
import DetailsSection from "@/components/details-section";
import GoogleMap from "@/components/google-map";

type PropertyDetailsProps = {
  params: { id: string };
};

const PropertyDetails: React.FC<PropertyDetailsProps> = ({
  params,
}: PropertyDetailsProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* First Row: Left Side (Carousel) */}
        <div className="md:col-span-1">
          {/* Carousel Component Here */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <Carousel
              images={[
                {
                  src: "https://picsum.photos/id/1/500/300",
                  alt: "Property Type",
                },
                {
                  src: "https://picsum.photos/id/2/500/300",
                  alt: "Property Type",
                },
                {
                  src: "https://picsum.photos/id/3/500/300",
                  alt: "Property Type",
                },
                {
                  src: "https://picsum.photos/id/4/500/300",
                  alt: "Property Type",
                },
                {
                  src: "https://picsum.photos/id/5/500/300",
                  alt: "Property Type",
                },
              ]}
            />
          </div>
        </div>

        {/* <!-- First Row: Right Side (Property Details) --> */}
        <div className="md:col-span-1">
          {/* <!-- Property Details Component Here --> */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <DetailsSection
              data={{
                name: "ABCD Property",
                address: "Some Address",
                phone: "1234567890",
                type: "House",
                description: "Some description about the property.",
              }}
            />
          </div>
        </div>

        {/* <!-- Second Row: Full Width (Map Component) --> */}
        <div className="md:col-span-2 flex justify-center items-center">
          {/* <!-- Map Component Here --> */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <GoogleMap src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBZF8RwjhXobKAGSfq5ZEpVMdGkVRROGZA&q=11406+RUSTIC+ROCK+DRIVE,+Austin,+TX+78750&zoom=15" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
