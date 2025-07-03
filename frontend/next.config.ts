import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'notecraft-project.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
   }
  /* config options here */
};

export default nextConfig;
