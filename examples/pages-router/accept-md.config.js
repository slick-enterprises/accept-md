/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown'],
  // The example dev server runs on port 3001, so set baseUrl explicitly
  // so the markdown handler fetches the correct origin.
  baseUrl: 'http://localhost:3001',
  outputMode: 'markdown',
  cache: true,
  transformers: [],
};
