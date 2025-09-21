/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: { 
    serverActions: { bodySizeLimit: '2mb' } 
  },
  images: { 
    remotePatterns: [{ protocol: 'https', hostname: '**' }] 
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = config;