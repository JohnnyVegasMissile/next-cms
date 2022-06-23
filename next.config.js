/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        UPLOADS_IMAGES_DIR: '/uploads/images',
        SITE_URL: 'http://localhost:3000',
    },
}

module.exports = nextConfig
