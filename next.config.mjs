/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "useful-albatross-884.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
