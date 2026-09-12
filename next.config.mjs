/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    return [
      {
        source: "/journal",
        destination: "/blog",
      },
      {
        source: "/journal/:slug*",
        destination: "/blog/:slug*",
      },
    ];
  },
};

export default nextConfig;
