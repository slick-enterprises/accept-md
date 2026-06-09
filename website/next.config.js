/** @type { import('next').NextConfig } */
const nextConfig = {
  reactStrictMode: true,

  redirects: async () => [
    {
      source: "/check",
      destination: "/markdown-audit",
      permanent: true,
    },
    {
      source: "/blog/serve-markdown-nextjs-without-puppeteer",
      destination: "/blog/nextjs-markdown-export-puppeteer-vs-accept-header",
      permanent: true,
    },
  ],

  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/api/accept-md?path=:path*',
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
