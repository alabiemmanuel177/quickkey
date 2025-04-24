import type { NextConfig } from "next";

// Read version from package.json
const { version } = require('./package.json');

// Get the deployment URL for OG image generation
const deploymentUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BASE_URL: deploymentUrl
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      ...(process.env.VERCEL_URL ? [{
        protocol: 'https',
        hostname: process.env.VERCEL_URL
      }] : [])
    ],
  },
  serverExternalPackages: [],
};

export default nextConfig;
