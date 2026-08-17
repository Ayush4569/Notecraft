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
   },
  compiler:{
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_ACTUAL_BACKEND_URL || "http://localhost:8000";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  }
};

export default nextConfig;
