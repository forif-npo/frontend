import type { NextConfig } from "next";

const backendFileImagePattern = (() => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!serverUrl) return [];

  try {
    const url = new URL(serverUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return [];
    return [
      {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        port: url.port || undefined,
        pathname: "/api/v1/files/**",
      },
    ];
  } catch {
    return [];
  }
})();

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
      {
        protocol: "https",
        hostname: "study-cardnews.s3.ap-northeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "miro.medium.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-images-1.medium.com",
        pathname: "/**",
      },
      ...backendFileImagePattern,
    ],
  },
};

export default nextConfig;
