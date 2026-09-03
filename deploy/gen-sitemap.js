#!/usr/bin/env node
/* sitemap.xml ni katalogdan avtomatik yaratadi:
     node deploy/gen-sitemap.js
   Deploy workflow'i har push'da shuni ishga tushiradi, shuning uchun
   admin panelda yangi mahsulot qo'shilsa ham sitemap yangilanib turadi. */
const fs = require('fs'), path = require('path');
global.window = {};
require(path.join(__dirname, '..', 'assets', 'js', 'data.js'));
const S = global.window.SEED;
const BASE = 'https://mydrone.uz';
const today = new Date().toISOString().slice(0, 10);

const urls = [
  ['/', '1.0', 'daily'],
  ['/katalog', '0.9', 'daily'],
  ...S.categories.map(c => ['/katalog?cat=' + c.id, '0.8', 'weekly']),
  ...S.products.map(p => ['/mahsulot/' + p.slug, '0.8', 'weekly']),
  ['/blog', '0.6', 'weekly'],
  ...S.posts.map(b => ['/blog/' + b.slug, '0.6', 'monthly']),
  ['/referal-dastur', '0.5', 'monthly'],
  ['/yetkazib-berish', '0.5', 'monthly'],
  ['/kafolat', '0.5', 'monthly'],
  ['/biz-haqimizda', '0.4', 'monthly'],
  ['/aloqa', '0.4', 'monthly'],
  ['/savollar', '0.5', 'monthly']
];

const esc = s => s.replace(/&/g, '&amp;');
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(([loc, pr, cf]) =>
    '  <url>\n    <loc>' + esc(BASE + loc) + '</loc>\n' +
    '    <lastmod>' + today + '</lastmod>\n' +
    '    <changefreq>' + cf + '</changefreq>\n' +
    '    <priority>' + pr + '</priority>\n  </url>').join('\n') +
  '\n</urlset>\n';

fs.writeFileSync(path.join(__dirname, '..', 'sitemap.xml'), xml);
console.log('sitemap.xml yaratildi — ' + urls.length + ' ta manzil');
