/** @type {import('next-sitemap').IConfig} */

const config = {
    siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    changefreq: 'daily',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/admin*', '/install', '/api*', '/server-sitemap.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${
                process.env.SITE_URL || 'http://localhost:3000'
            }/server-sitemap-index.xml`,
        ],
    },
}

module.exports = config
