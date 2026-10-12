import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory makes Next infer the wrong workspace root.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
