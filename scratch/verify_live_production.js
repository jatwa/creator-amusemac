const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://creator-amusemac.vercel.app';

const routes = [
  '/',
  '/tools',
  '/categories/video',
  '/prompts',
  '/prompts/factory',
  '/compare',
  '/workflows',
  '/tutorials',
  '/blog',
  '/videos',
  '/stories',
  '/festivals',
  '/kits',
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/search',
  '/resources',
  '/robots.txt',
  '/sitemap.xml',
  // Dynamic routes
  '/tools/runway',
  '/tools/kling',
  '/prompts/cinematic-bike-commercial',
  '/blog/state-of-generative-video-2026',
  '/videos/runway-gen-3-camera-control-masterclass',
  '/stories/the-lucid-ride',
  '/compare/runway-vs-kling',
];

function fetchRoute(route) {
  return new Promise((resolve) => {
    const url = `${baseUrl}${route}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          route,
          status: res.statusCode,
          ok: res.statusCode === 200,
          contentLength: data.length,
          hasTitle: data.includes('<title>'),
          hasBody: data.includes('Creator by Amusemac') || data.includes('sitemap') || data.includes('User-agent'),
        });
      });
    }).on('error', (err) => {
      resolve({
        route,
        status: 'ERROR',
        ok: false,
        error: err.message,
      });
    });
  });
}

async function runLiveAudit() {
  console.log('--- STARTING LIVE PRODUCTION QA VERIFICATION ON VERCEL ---');
  console.log(`Target Base URL: ${baseUrl}\n`);
  
  const results = [];
  let allPass = true;

  for (const r of routes) {
    const res = await fetchRoute(r);
    results.push(res);
    if (res.ok) {
      console.log(`✓ [${res.status}] ${r} (${res.contentLength} bytes)`);
    } else {
      console.error(`✗ [${res.status}] ${r} - FAIL`);
      allPass = false;
    }
  }

  fs.writeFileSync(path.join(__dirname, 'live_production_results.json'), JSON.stringify(results, null, 2));
  console.log('\n--- LIVE PRODUCTION AUDIT SUMMARY ---');
  console.log(`Total Routes Tested: ${results.length}`);
  console.log(`All Passed: ${allPass ? 'YES' : 'NO'}`);
  return allPass;
}

runLiveAudit();
