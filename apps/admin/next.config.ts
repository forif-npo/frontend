import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: [
    "@t3-oss/env-nextjs",
    "@t3-oss/env-core",
    "@repo/ui",
    "@repo/big-calendar",
  ],
};

export default nextConfig;
