const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3007;
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

// Use chrome with user-data-dir and pre-injected localStorage or emulate light mode
// In chromium headless, we can emulate light theme with --blink-settings=preferredColorScheme=0 or --force-dark-mode=false
function captureExplicitLight(urlPath, filename) {
  return new Promise((resolve) => {
    const fullUrl = `http://localhost:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--blink-settings=preferredColorScheme=0',
      '--window-size=1440,900',
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fullUrl
    ];

    const chrome = spawn(CHROME_PATH, args);
    chrome.on('close', () => {
      resolve();
    });
  });
}

async function run() {
  await waitForServer();
  await captureExplicitLight('/', '01_homepage_explicit_light.png');
  await captureExplicitLight('/categories/video', '02_video_hub_explicit_light.png');
  await captureExplicitLight('/tools/runway', '04_tool_runway_explicit_light.png');
  nextServer.kill();
  process.exit(0);
}

run();
