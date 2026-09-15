/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (!dev && process.env.FORIF_LOCAL_BUILD === "1") {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
