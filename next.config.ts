import type { NextConfig } from "next";

// Read version from package.json
const { version } = require('./package.json');

// Get the deployment URL for OG image generation
const deploymentUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

// Create domains array with type assertion to fix TypeScript error
const domains: string[] = ['localhost', 'avatars.githubusercontent.com'];
if (process.env.VERCEL_URL) {
  domains.push(process.env.VERCEL_URL);
}

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BASE_URL: deploymentUrl
  },
  images: {
    domains,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  }
};

export default nextConfig;
