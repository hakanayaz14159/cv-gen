/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Enables standalone output for containerized deployments
  reactStrictMode: true,
  swcMinify: true,
  // Configure image domains if you're using Next.js Image component with external images
  images: {
    domains: [],
  },
  // Disable unnecessary features for this project
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
