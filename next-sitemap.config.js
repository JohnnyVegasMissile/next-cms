/** @type {import('next-sitemap').IConfig} */

const config = {
    siteUrl: process.env.SITE_URL || 'https://localhost.com',
    changefreq: 'daily',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/admin*', '/install', '/api*', '/server-sitemap.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [
            `${process.env.SITE_URL}/server-sitemap-index.xml`,
        ],
    },
}

module.exports = config
