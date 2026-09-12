const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.join(__dirname, 'screenshots_launch_verified');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const routes = [
  { name: '01_homepage_desktop_1440', url: 'http://localhost:3000/', width: 1440, height: 900 },
  { name: '02_homepage_mobile_390', url: 'http://localhost:3000/', width: 390, height: 844 },
  { name: '03_categories_video_desktop_1440', url: 'http://localhost:3000/categories/video', width: 1440, height: 900 },
  { name: '04_tools_directory_desktop_1440', url: 'http://localhost:3000/tools', width: 1440, height: 900 },
  { name: '05_tool_runway_dossier_1440', url: 'http://localhost:3000/tools/runway', width: 1440, height: 900 },
  { name: '06_prompts_factory_desktop_1440', url: 'http://localhost:3000/prompts', width: 1440, height: 900 },
  { name: '07_stories_case_studies_1440', url: 'http://localhost:3000/stories', width: 1440, height: 900 },
  { name: '08_story_lucid_ride_detail_1440', url: 'http://localhost:3000/stories/the-lucid-ride', width: 1440, height: 900 },
  { name: '09_festivals_directory_1440', url: 'http://localhost:3000/festivals', width: 1440, height: 900 },
  { name: '10_kits_downloads_1440', url: 'http://localhost:3000/kits', width: 1440, height: 900 },
  { name: '11_search_instant_1440', url: 'http://localhost:3000/search?q=video', width: 1440, height: 900 },
  { name: '12_about_philosophy_1440', url: 'http://localhost:3000/about', width: 1440, height: 900 },
  { name: '13_privacy_policy_1440', url: 'http://localhost:3000/privacy', width: 1440, height: 900 },
];

console.log('--- STARTING LAUNCH DAY VISUAL QA RUNNER ---');

routes.forEach((r, idx) => {
  const outPath = path.join(outputDir, `${r.name}.png`);
  console.log(`[${idx + 1}/${routes.length}] Capturing ${r.name} (${r.width}x${r.height})...`);
  try {
    const cmd = `"${chromePath}" --headless=new --window-size=${r.width},${r.height} --hide-scrollbars --virtual-time-budget=4000 --screenshot="${outPath}" "${r.url}"`;
    execSync(cmd, { stdio: 'pipe' });
    console.log(`✓ Saved: ${outPath} (${fs.statSync(outPath).size} bytes)`);
  } catch (err) {
    console.error(`✗ Error capturing ${r.name}:`, err.message);
  }
});

console.log('--- ALL SCREENSHOTS CAPTURED SUCCESSFULLY ---');
