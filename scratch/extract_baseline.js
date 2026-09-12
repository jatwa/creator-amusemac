const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Extract platform-data at commit 0b9a000
try {
  const baselineDataStr = execSync('git show 0b9a000:data/platform-data.ts', { maxBuffer: 10 * 1024 * 1024 }).toString();
  fs.writeFileSync(path.join(__dirname, 'baseline-platform-data.ts'), baselineDataStr);
  console.log('Saved baseline-platform-data.ts successfully.');
} catch (e) {
  console.error('Error fetching baseline:', e.message);
}
