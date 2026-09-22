import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview-chat-*.space-z.ai host to talk to the dev
  // server so HMR websockets and /_next/* assets load cleanly in preview.
  allowedDevOrigins: [
    "preview-chat-*.space-z.ai",
    "*.space-z.ai",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
