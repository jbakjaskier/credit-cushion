import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.rezdy*.com' //THis is for rezdy
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.*' //This is for FareHarbour
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com' //This is for UnSplash
      }
    ]
  }
};

export default nextConfig;
