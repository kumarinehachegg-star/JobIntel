#!/usr/bin/env node
const fs = require('fs');
const fetch = require('node-fetch');

const BACKEND = process.env.BACKEND_URL || 'http://localhost:4000';
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';

(async function() {
  try {
    const res = await fetch(`${BACKEND}/api/jobs`);
    const jobs = await res.json();
    const urls = jobs.map(j => {
      const loc = `${FRONTEND.replace(/\/$/, '')}/jobs/${j._id || j.id}`;
      const lastmod = new Date(j.updatedAt || j.createdAt || Date.now()).toISOString();
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    }).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
    fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
    console.log('Wrote public/sitemap.xml');
  } catch (err) {
    console.error('Failed to generate sitemap', err.message || err);
    process.exit(1);
  }
})();
