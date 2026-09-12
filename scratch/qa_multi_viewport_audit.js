const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, 'screenshots_integrity_audit');
const port = 3005;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewports = [
  { name: 'mobile_390', width: 390, height: 844 },
  { name: 'mobile_430', width: 430, height: 932 },
  { name: 'tablet_768', width: 768, height: 1024 },
  { name: 'laptop_1024', width: 1024, height: 768 },
  { name: 'desktop_1440', width: 1440, height: 900 },
  { name: 'ultrawide_1920', width: 1920, height: 1080 },
];

const testRoutes = [
  { name: 'home', path: '/' },
  { name: 'categories_video', path: '/categories/video' },
  { name: 'tools_index', path: '/tools' },
  { name: 'tool_runway', path: '/tools/runway' },
  { name: 'tool_kling', path: '/tools/kling' },
  { name: 'prompts_index', path: '/prompts' },
  { name: 'prompts_factory', path: '/prompts/factory' },
  { name: 'compare_index', path: '/compare' },
  { name: 'compare_runway_kling', path: '/compare/runway-vs-kling' },
  { name: 'stories_index', path: '/stories' },
  { name: 'story_lucid_ride', path: '/stories/the-lucid-ride' },
  { name: 'festivals_index', path: '/festivals' },
  { name: 'kits_index', path: '/kits' },
  { name: 'workflows_index', path: '/workflows' },
  { name: 'blog_index', path: '/blog' },
  { name: 'videos_index', path: '/videos' },
  { name: 'search_query', path: '/search?q=video' },
  { name: 'about', path: '/about' },
  { name: 'privacy', path: '/privacy' },
  { name: 'terms', path: '/terms' },
  { name: 'contact', path: '/contact' },
  { name: 'not_found_404', path: '/non-existent-test-route' },
];

console.log(`--- STARTING QA AUDIT RUNNER ON PORT ${port} ---`);

const qaResults = [];

// 1. Capture each viewport for Home
viewports.forEach(vp => {
  const filename = `home_${vp.name}.png`;
  const outPath = path.join(outputDir, filename);
  console.log(`Capturing Home at ${vp.name} (${vp.width}x${vp.height})...`);
  try {
    const cmd = `"${chromePath}" --headless=new --window-size=${vp.width},${vp.height} --hide-scrollbars --virtual-time-budget=3000 --screenshot="${outPath}" "http://localhost:${port}/"`;
    execSync(cmd, { stdio: 'pipe' });
    const size = fs.statSync(outPath).size;
    qaResults.push({ test: `Home @ ${vp.name}`, status: 'PASS', size, file: filename });
    console.log(`✓ Saved: ${filename} (${size} bytes)`);
  } catch (err) {
    qaResults.push({ test: `Home @ ${vp.name}`, status: 'FAIL', error: err.message });
    console.error(`✗ Error: ${err.message}`);
  }
});

// 2. Capture each test route at 1440px desktop
testRoutes.forEach(r => {
  const filename = `route_${r.name}_1440.png`;
  const outPath = path.join(outputDir, filename);
  console.log(`Auditing route: ${r.path}...`);
  try {
    const cmd = `"${chromePath}" --headless=new --window-size=1440,900 --hide-scrollbars --virtual-time-budget=3000 --screenshot="${outPath}" "http://localhost:${port}${r.path}"`;
    execSync(cmd, { stdio: 'pipe' });
    const size = fs.statSync(outPath).size;
    qaResults.push({ test: `Route ${r.path}`, status: 'PASS', size, file: filename });
    console.log(`✓ Saved: ${filename} (${size} bytes)`);
  } catch (err) {
    qaResults.push({ test: `Route ${r.path}`, status: 'FAIL', error: err.message });
    console.error(`✗ Error: ${err.message}`);
  }
});

fs.writeFileSync(path.join(outputDir, 'qa_summary.json'), JSON.stringify(qaResults, null, 2));
console.log('--- ALL MULTI-VIEWPORT SCREENSHOTS CAPTURED ON PORT 3005 ---');
