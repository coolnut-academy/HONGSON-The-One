import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.firebasestorage.app",
      },
      {
        protocol: "https",
        hostname: "*.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "*.google.com",
      },
      {
        protocol: "https",
        hostname: "*.canva.com",
      },
      {
        protocol: "https",
        hostname: "*.quizizz.com",
      },
      {
        protocol: "https",
        hostname: "*.kahoot.com",
      },
      {
        protocol: "https",
        hostname: "*.youtube.com",
      },
    ],
  },
};

export default nextConfig;

