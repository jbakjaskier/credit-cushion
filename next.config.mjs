/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '11mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.rezdy*.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.*",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.tiny.cloud",
              "style-src 'self' 'unsafe-inline' https://cdn.tiny.cloud",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.openai.com https://cdn.tiny.cloud",
              "frame-src 'self' blob: data:",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    
    if (isServer) {
      config.externals.push("puppeteer");
    }
    return config;
  }
};

export default nextConfig; 