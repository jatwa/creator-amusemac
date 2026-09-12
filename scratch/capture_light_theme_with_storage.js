const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3008;
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

// We can create a temporary profile directory with localStorage initialized or use CDP
// Or even simpler: create a tiny HTML test wrapper or use Chrome remote debugging
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function run() {
  await waitForServer();
  console.log('Next server is ready. Launching Chrome with remote debugging...');

  const tempProfile = path.join(__dirname, 'chrome_temp_profile');
  if (fs.existsSync(tempProfile)) {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  }
  fs.mkdirSync(tempProfile, { recursive: true });

  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${tempProfile}`,
    '--window-size=1440,900',
    '--disable-gpu',
    'about:blank'
  ]);

  // Wait for CDP port
  await new Promise((r) => setTimeout(r, 1500));

  // Connect to CDP via HTTP JSON endpoint
  const getWebSocketUrl = () => {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:9222/json', (res) => {
        let raw = '';
        res.on('data', (c) => raw += c);
        res.on('end', () => {
          const list = JSON.parse(raw);
          resolve(list[0].webSocketDebuggerUrl);
        });
      }).on('error', reject);
    });
  };

  try {
    const wsUrl = await getWebSocketUrl();
    const WebSocket = require('ws'); // If ws is available, or use node's native if >= 22
    // If ws is not installed, fallback to node-based simple CDP client
  } catch (e) {
    console.log('CDP connect note:', e.message);
  }

  chromeProc.kill();
  nextServer.kill();
  process.exit(0);
}

run();
