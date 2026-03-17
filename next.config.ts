import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.stockx.com' },
      { protocol: 'https', hostname: 'image.goat.com' },
      { protocol: 'https', hostname: 'cdn.flightclub.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'stockx-assets.imgix.net' },
      { protocol: 'https', hostname: '**.stockx.com' },
      { protocol: 'https', hostname: '**.goat.com' },
    ],
  },
};

export default nextConfig;
