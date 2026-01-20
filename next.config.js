/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Отключаем телеметрию Next.js
  telemetry: false,
  // Отключаем кэширование в dev режиме для API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

