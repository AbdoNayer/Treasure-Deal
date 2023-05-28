/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    domains: [
        'team-connect.treasuredeal.com',
        'img.youtube.com',
        'derbysoft.leonardocontentcloud.com',
        'via.placeholder.com',
        'www.cfmedia.vfmleonardo.com',
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
