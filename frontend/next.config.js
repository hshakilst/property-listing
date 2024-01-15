/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["s3.amazon.com", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazon.com",
      },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
