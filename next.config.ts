import type { NextConfig } from "next";

// Read version from package.json
const { version } = require('./package.json');

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_APP_VERSION: version
  }
};

export default nextConfig;
