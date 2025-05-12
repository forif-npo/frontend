import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core", "@repo/ui"],
};

export default nextConfig;
