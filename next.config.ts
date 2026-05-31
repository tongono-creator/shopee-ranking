import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "**.shp-live.net" },
      { protocol: "https", hostname: "**.shopee.co.th" },
      { protocol: "https", hostname: "cf.shopee.co.th" },
      { protocol: "https", hostname: "down-th.img.susercontent.com" },
      { protocol: "https", hostname: "down-bs-th.img.susercontent.com" },
    ],
  },
};

export default nextConfig;
