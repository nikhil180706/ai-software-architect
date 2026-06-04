import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // ONLY apply this rewrite on your local computer.
    // On Vercel, your vercel.json file takes over and routes traffic to Python.
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }
    
    // In production, do nothing. Let Vercel handle it.
    return [];
  },
};

export default nextConfig;