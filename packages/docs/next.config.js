/* eslint-disable @typescript-eslint/no-var-requires */

const withLinaria = require('next-linaria')

/**
 * @type {import('next').NextConfig}
 */
const config = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  experimental: {
    esmExternals: true
  },
  redirects: async () => {
    return [
      {
        source: '/docs',
        destination: '/docs/get-started',
        permanent: true
      }
    ]
  }
}
const withNextra = require('nextra')(config)
module.exports = withLinaria(withNextra())
