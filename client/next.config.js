/**@type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  basePath: "",
  assetPrefix: "",
  env: {
    CUSTOM_ENV: process.env.CUSTOM_ENV,
  },
  images: {
    unoptimized: true,
    loader: "imgix",
    path: "/",
  },
};

module.exports = nextConfig;
