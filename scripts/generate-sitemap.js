#!/usr/bin/env node

/**
 * Sitemap Generation Script
 * Generates sitemap.xml with current timestamp
 */

const fs = require('fs');

console.log('🗺️  Generating sitemap...');

const baseUrl = 'https://yourusername.github.io/claude-code-learning-portfolio';
const currentDate = new Date().toISOString();

const pages = [
    { url: '/', priority: '1.0', changefreq: 'monthly' },
    { url: '/#about', priority: '0.9', changefreq: 'monthly' },
    { url: '/#projects', priority: '0.9', changefreq: 'weekly' },
    { url: '/#skills', priority: '0.8', changefreq: 'monthly' },
    { url: '/#journey', priority: '0.8', changefreq: 'weekly' },
    { url: '/#terminal', priority: '0.7', changefreq: 'monthly' },
    { url: '/#contact', priority: '0.8', changefreq: 'monthly' }
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${pages.map(page => `  <!-- ${page.url === '/' ? 'Homepage' : page.url.replace('/#', '') + ' Section'} -->
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapXml);
console.log('✅ Sitemap generated with current timestamp');
console.log(`📍 Base URL: ${baseUrl}`);
console.log(`📅 Last modified: ${currentDate}`);