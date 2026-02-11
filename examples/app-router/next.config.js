/** @type { import('next').NextConfig } */
const nextConfig = {
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/api/accept-md/:path*',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*)text/markdown(.*)',
            },
          ],
        },
      ],
    };
  },
};
module.exports = nextConfig;
