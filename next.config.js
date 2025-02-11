/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This is needed for react-pdf to work
    config.resolve.alias.canvas = false
    
    // Exclude the worker from being processed by webpack
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js/,
      type: 'asset/resource'
    })
    
    return config
  },
  // Add this to ensure static files are served correctly
  async headers() {
    return [
      {
        source: '/pdf-worker/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 