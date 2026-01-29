import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/todo-app',
  assetPrefix: '/todo-app',
  distDir: 'docs',
};

export default nextConfig;
