import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  } as unknown as NonNullable<NextConfig["devIndicators"]>,
  allowedDevOrigins: [
    "426900b628648b.lhr.life",
    "*.lhr.life",
  ],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
