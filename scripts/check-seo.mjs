import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const mainPages = [
  '/',
  '/about/',
  '/services/',
  '/contact/',
  '/direct-billing/',
  '/gallery/',
  '/reviews/',
];
const serviceFiles = (await readdir('src/content/services')).filter((file) =>
  file.endsWith('.md')
);
const routes = [
  ...mainPages,
  ...serviceFiles.map((file) => `/services/${file.slice(0, -3)}/`),
];
const ogUrls = new Set();
const descriptions = new Set();

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}
function metadata(html, key) {
  const tags = [...html.matchAll(/<meta\b[^>]*>/g)].map((match) => match[0]);
  const matching = tags.filter(
    (tag) =>
      attribute(tag, 'name') === key || attribute(tag, 'property') === key
  );
  assert.equal(matching.length, 1, `Expected one ${key} tag`);
  return attribute(matching[0], 'content');
}

for (const route of routes) {
  const html = await readFile(join('dist', route, 'index.html'), 'utf8');
  const titles = [...html.matchAll(/<title>(.*?)<\/title>/g)];
  assert.equal(titles.length, 1, `${route}: one title`);
  assert.equal(
    (titles[0][1].match(/Glow and Relax/g) || []).length,
    1,
    `${route}: brand appears once`
  );
  const description = metadata(html, 'description');
  assert(description.trim().length > 0, `${route}: description is present`);
  assert.equal(metadata(html, 'og:description'), description);
  assert.equal(metadata(html, 'twitter:description'), description);
  assert(!descriptions.has(description), `${route}: distinct description`);
  descriptions.add(description);
  const imageUrl = metadata(html, 'og:image');
  assert(
    imageUrl.startsWith('https://glowandrelax.ca/og/'),
    `${route}: absolute image URL`
  );
  assert(!ogUrls.has(imageUrl), `${route}: distinct image`);
  ogUrls.add(imageUrl);
  assert.equal(metadata(html, 'twitter:image'), imageUrl);
  assert.equal(metadata(html, 'og:image:width'), '1200');
  assert.equal(metadata(html, 'og:image:height'), '630');
  assert.equal(metadata(html, 'og:image:type'), 'image/png');
  assert(metadata(html, 'og:image:alt').length > 20);
  assert.equal(
    metadata(html, 'twitter:image:alt'),
    metadata(html, 'og:image:alt')
  );
  assert.equal(metadata(html, 'og:url'), `https://glowandrelax.ca${route}`);
  const png = await readFile(join('dist', new URL(imageUrl).pathname));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}
const cards = (await readdir('dist/og')).filter((file) =>
  file.endsWith('.png')
);
assert.equal(
  cards.length,
  routes.length + 1,
  'One card per route plus global fallback'
);
for (const file of cards)
  assert(
    (await stat(join('dist/og', file))).size < 2 * 1024 * 1024,
    `${file}: below 2 MB`
  );
const cupping = await readFile('dist/services/cupping/index.html', 'utf8');
const cuppingH1 = cupping
  .match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1]
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
assert.equal(cuppingH1, 'Cupping');
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
assert(!sitemap.includes('/dev/'), 'No development preview in sitemap');
await assert.rejects(stat('dist/dev/og/index.html'), { code: 'ENOENT' });
console.log(
  `Validated ${routes.length} pages and ${cards.length} 1200x630 PNG cards.`
);
