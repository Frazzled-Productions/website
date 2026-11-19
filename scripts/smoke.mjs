#!/usr/bin/env node
// Smoke check for a deployed (or locally previewed) copy of the site.
//
//   node scripts/smoke.mjs <base-url> [--production]
//
// Requests every page and expects 200 (and 404 for /loop-year, which has no page), fails if
// any page still carries Vercel Analytics or any response sets a cookie, and with
// --production also requires the home page's "Support the studio" button (KOFI_URL set at
// build) and the Cloudflare Web Analytics beacon. Exits 1 on any failure.

const [base, flag] = process.argv.slice(2);
if (!base) {
  console.error('Usage: node scripts/smoke.mjs <base-url> [--production]');
  process.exit(2);
}
const production = flag === '--production';

const pages = [
  '/',
  '/privacy',
  '/roast-conductor',
  '/roast-conductor/privacy',
  '/roast-conductor/support',
  '/roast-conductor/sample-recipe',
  '/loop-year/privacy',
  '/loop-year/support',
];
const expectations = [...pages.map((path) => [path, 200]), ['/loop-year', 404]];

const failures = [];

for (const [path, expected] of expectations) {
  const url = new URL(path, base).toString();
  let res;
  try {
    res = await fetch(url, { redirect: 'manual' });
  } catch (error) {
    failures.push(`${path}: request failed (${error.message})`);
    continue;
  }
  const html = await res.text();
  const notes = [];

  if (res.status !== expected) notes.push(`status ${res.status}, expected ${expected}`);
  if (res.headers.get('set-cookie')) notes.push('sets a cookie');
  if (html.includes('_vercel/insights') || html.includes('va.vercel-scripts.com')) {
    notes.push('still carries Vercel Analytics');
  }
  if (production && path === '/') {
    if (!html.includes('Support the studio')) notes.push('no "Support the studio" button (KOFI_URL unset?)');
    if (!html.includes('static.cloudflareinsights.com/beacon.min.js')) {
      notes.push('no Cloudflare Web Analytics beacon (NEXT_PUBLIC_CF_BEACON_TOKEN unset?)');
    }
  }

  if (notes.length) failures.push(`${path}: ${notes.join('; ')}`);
  else console.log(`ok   ${res.status} ${path}`);
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log(`All ${expectations.length} checks passed against ${base}${production ? ' (production)' : ''}.`);
