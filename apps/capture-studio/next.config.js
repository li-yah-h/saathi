/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@echovoice/shared-types',
    '@echovoice/supabase-client',
    '@echovoice/ai-client',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
