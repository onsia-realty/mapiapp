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
      {
        protocol: "https",
        hostname: "hf-sclass.com",
      },
      {
        protocol: "https",
        hostname: "*.com",
      },
      {
        protocol: "https",
        hostname: "*.kr",
      },
    ],
  },
};

export default nextConfig;
