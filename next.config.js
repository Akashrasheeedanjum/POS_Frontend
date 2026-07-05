/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint:{
 ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ],
     domains: ['res.cloudinary.com'],
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
