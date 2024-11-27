import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com'
      }
    ]
  }
};

export default nextConfig;
