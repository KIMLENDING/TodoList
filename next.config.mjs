/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러 무시
  },
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
