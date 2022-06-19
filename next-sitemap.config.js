/** @type {import('next-sitemap').IConfig} */

const config = {
    siteUrl: process.env.SITE_URL || 'https://example.com',
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: ['/admin', '/install', '/api'],
}

export default config
