/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["s3.amazon.com", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "property-listing.s3.us-west-1.amazonaws.com",
      },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
