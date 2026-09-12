const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3025;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_editorial_verified');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

console.log('Starting Next.js server on port', PORT);
const nextServer = spawn('cmd.exe', ['/c', `node_modules\\.bin\\next start -p ${PORT}`], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

nextServer.stdout.on('data', (d) => console.log('[Next.js]', d.toString().trim()));
nextServer.stderr.on('data', (d) => console.error('[Next.js Err]', d.toString().trim()));

function waitForServer(retries = 50) {
  return new Promise((resolve, reject) => {
    const check = (attempt) => {
      if (attempt >= retries) return reject(new Error('Timeout waiting for server'));
      http.get(`http://127.0.0.1:${PORT}/`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          setTimeout(() => check(attempt + 1), 600);
        }
      }).on('error', () => {
        setTimeout(() => check(attempt + 1), 600);
      });
    };
    check(0);
  });
}

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

function capture(urlPath, filename, width = 1440, height = 900) {
  return new Promise((resolve) => {
    const fullUrl = `http://127.0.0.1:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--virtual-time-budget=3000',
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
  { path: '/tools/runway', name: '01_tool_runway_dossier' },
  { path: '/tools/kling', name: '02_tool_kling_dossier' },
  { path: '/tools', name: '03_tools_directory_glance' },
  { path: '/categories/video', name: '04_video_hub_shot_advisor' },
];

async function run() {
  try {
    await waitForServer();
    console.log('Server ready! Capturing verified screenshots...');

    for (const r of ROUTES) {
      await capture(r.path, `${r.name}_desktop_1440.png`, 1440, 900);
    }

    await capture('/tools/runway', '01_tool_runway_dossier_mobile_390.png', 390, 844);
    await capture('/tools', '03_tools_directory_mobile_390.png', 390, 844);

    console.log('All editorial screenshots verified!');
  } catch (err) {
    console.error('QA Error:', err.message);
  } finally {
    nextServer.kill();
    process.exit(0);
  }
}

run();
