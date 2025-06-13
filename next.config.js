/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  generateEtags: false,
  headers: async () => {
    return [
      {
        source: '/:all*(svg|jpg|png)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;