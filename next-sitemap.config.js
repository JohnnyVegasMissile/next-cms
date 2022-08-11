/** @type {import('next-sitemap').IConfig} */

const config = {
    siteUrl: process.env.SITE_URL || 'http://localhost:8080',
    changefreq: 'daily',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: ['/admin*', '/api*', '/server-sitemap-index.xml'],
    robotsTxtOptions: {
        additionalSitemaps: [`${process.env.SITE_URL || 'http://localhost:8080'}/server-sitemap-index.xml`],
    },
}

module.exports = config
