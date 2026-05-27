import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 14 keeps these under experimental; promoted to top-level in Next 15.
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../..'),
    outputFileTracingIncludes: {
      '/**': ['../../data/processed/springs_app_dataset_full.json'],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'springs-images.nyc3.cdn.digitaloceanspaces.com',
      },
    ],
  },
}

export default nextConfig
