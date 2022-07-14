module.exports = async (phase, { defaultConfig }) => {
    /**
     * @type {import('next').NextConfig}
     */

    // const lang = prisma.setting.findUnique({
    //     where: { name: 'revalidate' },
    // })

    // console.log('phase', phase)

    const nextConfig = {
        reactStrictMode: true,
        env: {
            UPLOADS_IMAGES_DIR: '/uploads/images',
            SITE_URL: 'http://localhost:8080',
            // i18n: {
            //     locales: ['en', 'fr', 'es', 'zh'],
            //     defaultLocale: 'en',
            // },
        },
    }
    return nextConfig
}
