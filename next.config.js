/** @type {import('next').NextConfig} */
// import { prisma } from '~/utilities/prisma'

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig
