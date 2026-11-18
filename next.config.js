/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['ik.imagekit.io', 'files.hubhopper.com', 'images.lystnfm.com'],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'Content-Security-Policy',
            // Tags loaded by Vodacom's Tealium container need their exact script and frame hosts here:
            // Meta Pixel, TikTok Pixel, Google Ads (gtag and conversion scripts), Adobe Audience Manager (demdex).
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://tags.tiqcdn.com https://*.tiqcdn.com https://cdn.cookielaw.org https://connect.facebook.net https://analytics.tiktok.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; media-src 'self' blob: https:; connect-src 'self' https://api.myuze.app https://*.tiqcdn.com https://*.tealiumiq.com https:; font-src 'self' data: https://fonts.gstatic.com; frame-src 'self' https://vodacomdls.demdex.net https://td.doubleclick.net https://www.googletagmanager.com; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },

  // Turbopack config
  turbopack: {
    root: __dirname,
    resolveAlias: {
      fs: { browser: '' },
      child_process: { browser: '' },
    },
  },

  // Agar Webpack config ZARURI hai dev mein, toh:
  webpack: (config, { isServer }) => {
    // Sirf production build mein use karo, dev mein nahi
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        child_process: false,
      };
    }
    return config;
  },

  async rewrites() {
    return [
      {
        source: '/profile',
        destination: '/dashboard/profile',
      },
      {
        source: '/search',
        destination: '/dashboard/search',
      },
      {
        source: '/category',
        destination: '/dashboard/category',
      },
      {
        source: '/library',
        destination: '/dashboard/library',
      },
      {
        source: '/profile/language',
        destination: '/dashboard/profile/language',
      },
      {
        source: '/home/podcast/:path*',
        destination: '/podcast/:path*',
      },
      {
        source: '/dashboard/episode/:path*',
        destination: '/episode/:path*',
      },
      {
        source: '/home/see-all/:path*',
        destination: '/see-all/:path*',
      },
    ];
  },
};