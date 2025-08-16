const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Sentry configuration
  sentry: {
    hideSourceMaps: true,
    widenClientFileUpload: true,
  },
}

// Sentry webpack plugin options
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // Only upload source maps in production
  silent: process.env.NODE_ENV !== 'production',
  
  // Upload source maps during build
  widenClientFileUpload: true,
  
  // Automatically tree-shake Sentry logger statements
  hideSourceMaps: true,
  
  // Disable webpack plugin in development
  disableLogger: process.env.NODE_ENV === 'development',
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
