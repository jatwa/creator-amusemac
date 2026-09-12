const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3009;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_apple_redesign_light');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

console.log('Starting next server on port', PORT);
const nextServer = spawn('cmd.exe', ['/c', `npx next start -p ${PORT}`], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

function waitForServer(retries = 30) {
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

function captureLightWithFlag(urlPath, filename, width = 1440, height = 900) {
  return new Promise((resolve) => {
    const fullUrl = `http://localhost:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--force-prefers-color-scheme=light',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fullUrl
    ];

    console.log(`Capturing Light [${width}x${height}] ${fullUrl} -> ${filename}`);
    const chrome = spawn(CHROME_PATH, args);
    chrome.on('close', () => {
      resolve();
    });
  });
}

async function run() {
  await waitForServer();
  await captureLightWithFlag('/', '01_homepage_light_desktop_1440.png', 1440, 900);
  await captureLightWithFlag('/categories/video', '02_video_hub_light_desktop_1440.png', 1440, 900);
  await captureLightWithFlag('/tools/runway', '04_tool_runway_light_desktop_1440.png', 1440, 900);
  await captureLightWithFlag('/compare/runway-vs-kling', '08_compare_light_desktop_1440.png', 1440, 900);
  await captureLightWithFlag('/blog', '09_blog_light_desktop_1440.png', 1440, 900);
  await captureLightWithFlag('/', '01_homepage_light_mobile_390.png', 390, 844);
  await captureLightWithFlag('/categories/video', '02_video_hub_light_mobile_390.png', 390, 844);
  console.log('Light captures with --force-prefers-color-scheme=light done!');
  nextServer.kill();
  process.exit(0);
}

run();
