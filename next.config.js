/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        UPLOADS_DIR: './public/uploads/images',
    },
}

module.exports = nextConfig
