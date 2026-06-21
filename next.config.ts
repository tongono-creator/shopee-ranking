import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.shp-live.net" },
      { protocol: "https", hostname: "**.shopee.co.th" },
      { protocol: "https", hostname: "cf.shopee.co.th" },
      { protocol: "https", hostname: "**.img.susercontent.com" },
    ],
  },
};

export default nextConfig;
