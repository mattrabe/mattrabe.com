import type { NextConfig } from "next";

const output = (process.env.NEXT_BUILD_TYPE === 'export' && 'export') ||
  (process.env.NEXT_BUILD_TYPE === 'standalone' && 'standalone') ||
  undefined

const nextConfig: NextConfig = {
  output,
  allowedDevOrigins: [ '*' ],
  /* config options here */
};

export default nextConfig;
