/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [{ source: "/dashboard", destination: "/", permanent: true }];
  },
};

module.exports = nextConfig;
