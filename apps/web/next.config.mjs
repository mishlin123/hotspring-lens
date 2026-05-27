/** @type {import('next').NextConfig} */
const nextConfig = {
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
