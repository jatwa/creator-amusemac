const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3005;
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots_apple_redesign');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Start next production server
console.log('Starting next server on port', PORT);
const nextServer = spawn('cmd.exe', ['/c', `npx next start -p ${PORT}`], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

nextServer.stdout.on('data', (d) => console.log(`[Next] ${d}`));
nextServer.stderr.on('data', (d) => console.error(`[Next Error] ${d}`));

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

function captureScreenshot(urlPath, filename, width = 1440, height = 900) {
  return new Promise((resolve, reject) => {
    const fullUrl = `http://localhost:${PORT}${urlPath}`;
    const outPath = path.join(SCREENSHOT_DIR, filename);
    const args = [
      '--headless=new',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      '--hide-scrollbars',
      `--screenshot=${outPath}`,
      fullUrl
    ];

    console.log(`Capturing [${width}x${height}] ${fullUrl} -> ${filename}`);
    const chrome = spawn(CHROME_PATH, args);
    chrome.on('close', (code) => {
      if (code === 0 && fs.existsSync(outPath)) {
        console.log(`✓ Saved ${filename}`);
        resolve();
      } else {
        console.error(`Failed to capture ${filename}, code ${code}`);
        resolve(); // don't crash whole suite
      }
    });
  });
}

async function runQA() {
  try {
    await waitForServer();

    const pages = [
      { path: '/', name: '01_homepage' },
      { path: '/categories/video', name: '02_categories_video' },
      { path: '/tools', name: '03_tools_index' },
      { path: '/tools/runway', name: '04_tool_runway_dossier' },
      { path: '/prompts', name: '05_prompts_index' },
      { path: '/prompts/cinematic-bike-commercial', name: '06_prompt_detail' },
      { path: '/compare', name: '07_compare_index' },
      { path: '/compare/runway-vs-kling', name: '08_compare_detail' },
      { path: '/blog', name: '09_blog_index' },
      { path: '/blog/state-of-generative-video-2026', name: '10_blog_detail' },
      { path: '/videos', name: '11_videos_index' },
      { path: '/videos/runway-gen-3-camera-control-masterclass', name: '12_video_detail' },
      { path: '/workflows', name: '13_workflows_index' },
      { path: '/workflows/30-second-cinematic-commercial', name: '14_workflow_detail' },
      { path: '/tutorials', name: '15_tutorials_index' },
      { path: '/tutorials/ai-commercial-production', name: '16_tutorial_detail' },
      { path: '/search?q=video', name: '17_search_results' },
    ];

    // 1. Desktop (1440x900)
    for (const p of pages) {
      await captureScreenshot(p.path, `${p.name}_desktop_1440.png`, 1440, 900);
    }

    // 2. Tablet (1024x768 & 768x1024)
    await captureScreenshot('/', '01_homepage_tablet_1024.png', 1024, 768);
    await captureScreenshot('/categories/video', '02_categories_video_tablet_768.png', 768, 1024);
    await captureScreenshot('/tools/runway', '04_tool_runway_tablet_768.png', 768, 1024);

    // 3. Mobile (390x844)
    for (const p of pages.slice(0, 8)) {
      await captureScreenshot(p.path, `${p.name}_mobile_390.png`, 390, 844);
    }

    console.log('QA captures complete!');
  } catch (err) {
    console.error('QA Runner error:', err);
  } finally {
    console.log('Terminating Next server...');
    nextServer.kill();
    process.exit(0);
  }
}

runQA();
