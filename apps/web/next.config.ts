import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: [
    "@t3-oss/env-nextjs",
    "@t3-oss/env-core",
    "@repo/ui",
    "msw",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "forif-backend-dev.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
