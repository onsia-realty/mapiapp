import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cluster-honorsville.co.kr",
      },
      {
        protocol: "https",
        hostname: "*.co.kr",
      },
    ],
  },
};

export default nextConfig;
