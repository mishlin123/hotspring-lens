import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Next.js file-tracing to reach the shared data/ directory at the
  // monorepo root (two levels above apps/web) so it's included in the
  // serverless function bundle on Vercel.
  outputFileTracingRoot: path.join(__dirname, '../..'),

  // Explicitly include the springs dataset in every server route's bundle.
  outputFileTracingIncludes: {
    '/**': ['../../data/processed/springs_app_dataset_full.json'],
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
