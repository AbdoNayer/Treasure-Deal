/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    domains: ['team-connect.treasuredeal.com', 'img.youtube.com']
  },
}

module.exports = nextConfig
