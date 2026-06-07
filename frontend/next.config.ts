import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.pstatic.net' },
      { protocol: 'https', hostname: 'nongshimmall.com' },
      { protocol: 'https', hostname: '**.orionworld.com' },
      { protocol: 'https', hostname: 'img.etnews.com' },
      { protocol: 'https', hostname: '**.news1.kr' },
      { protocol: 'https', hostname: 'img1.newsis.com' },
      { protocol: 'https', hostname: '**.daumcdn.net' },
      { protocol: 'https', hostname: 'crcf.cookatmarket.com' },
      { protocol: 'https', hostname: '**.naver.com' },
    ],
  },
};

export default nextConfig;
