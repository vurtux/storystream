/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    domains: ['ik.imagekit.io', 'files.hubhopper.com', 'images.lystnfm.com'],
  },

  // Turbopack config (webpack se replace kiya)
  turbo: {
    resolveAlias: {
      fs: false,
      child_process: false,
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