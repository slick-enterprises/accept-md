/** @type { import('accept-md-runtime').NextMarkdownConfig } */
module.exports = {
  include: ['/**'],
  exclude: ['/api/**', '/_next/**'],
  cleanSelectors: ['nav', 'footer', '.no-markdown', '[data-no-markdown]', 'script', 'style'],
  outputMode: 'markdown',
  cache: true,
  transformers: [],
};

