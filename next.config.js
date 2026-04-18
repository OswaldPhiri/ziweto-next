/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow images from any HTTPS source (sellers will paste image URLs)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
