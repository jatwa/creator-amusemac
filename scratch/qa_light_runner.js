const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3006;
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
          console.log('Next server is ready!');
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

// Use Chrome with dark-mode override disabled (light mode default) or light theme emulation
function captureScreenshot(urlPath, filename, width = 1440, height = 900) {
  return new Promise((resolve) => {
    const fullUrl = `http://localhost:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--force-color-profile=srgb',
      '--disable-features=WebContentsForceDark',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fullUrl
    ];

    console.log(`Capturing Light [${width}x${height}] ${fullUrl} -> ${filename}`);
    const chrome = spawn(CHROME_PATH, args);
    chrome.on('close', (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        console.log(`✓ Saved ${filename}`);
        resolve();
      } else {
        console.error(`Failed to capture ${filename}, code ${code}`);
        resolve();
      }
    });
  });
}

async function runQA() {
  try {
    await waitForServer();

    const pages = [
      { path: '/', name: '01_homepage_light' },
      { path: '/categories/video', name: '02_categories_video_light' },
      { path: '/tools/runway', name: '04_tool_runway_light' },
      { path: '/compare/runway-vs-kling', name: '08_compare_detail_light' },
      { path: '/blog', name: '09_blog_index_light' },
    ];

    for (const p of pages) {
      await captureScreenshot(p.path, `${p.name}_desktop_1440.png`, 1440, 900);
      await captureScreenshot(p.path, `${p.name}_mobile_390.png`, 390, 844);
    }

    console.log('Light mode QA captures complete!');
  } catch (err) {
    console.error('QA Runner error:', err);
  } finally {
    nextServer.kill();
    process.exit(0);
  }
}

runQA();
