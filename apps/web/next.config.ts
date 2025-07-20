import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core", "@repo/ui"],
};

export default nextConfig;
