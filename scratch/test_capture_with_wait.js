const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3011;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_motion_verified');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

console.log('Starting Next.js production server on port', PORT);
const nextServer = spawn('cmd.exe', ['/c', `npx next start -p ${PORT}`], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

function waitForServer(retries = 40) {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      if (attempt >= retries) return reject(new Error('Timeout waiting for server'));
      http.get(`http://localhost:${PORT}/`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(() => check(attempt + 1), 500);
        }
      }).on('error', () => {
        setTimeout(() => check(attempt + 1), 500);
      });
    };
    check(0);
  });
}

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function capture(urlPath, filename, width = 1440, height = 900) {
  return new Promise((resolve) => {
    const fullUrl = `http://localhost:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=2000',
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fullUrl
    ];

    console.log(`Capturing [${width}x${height}] ${fullUrl} -> ${filename}`);
    const chrome = spawn(CHROME_PATH, args);
    chrome.on('close', () => {
      resolve();
    });
  });
}

const ROUTES = [
  { path: '/', name: '01_homepage' },
  { path: '/categories/video', name: '02_video_hub' },
  { path: '/tools/runway', name: '04_tool_runway' },
  { path: '/prompts/cinematic-bike-commercial', name: '06_prompt_cinematic_bike' },
  { path: '/compare/runway-vs-kling', name: '08_compare_runway_vs_kling' },
  { path: '/blog', name: '09_blog_index' },
  { path: '/videos', name: '10_videos_index' },
  { path: '/search?q=video', name: '11_search_video' },
];

async function run() {
  await waitForServer();
  console.log('Server ready! Capturing verified screenshots with virtual time budget...');

  for (const r of ROUTES) {
    await capture(r.path, `${r.name}_desktop_1440.png`, 1440, 900);
  }

  // Mobile
  await capture('/', '01_homepage_mobile_390.png', 390, 844);
  await capture('/categories/video', '02_video_hub_mobile_390.png', 390, 844);

  console.log('All verified screenshots captured!');
  nextServer.kill();
  process.exit(0);
}

run();
