const fs = require('fs');
const path = require('path');

console.log('--- STARTING REAL INVENTORY AND DATA AUDIT ---');

// Let's import or parse the data files
const dataDir = path.join(__dirname, '../data');

function countArrayItems(fileName, exportName) {
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${fileName}`);
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Find export const [exportName] = [...]
  const regex = new RegExp(`export const ${exportName}\\s*(?::\\s*[^=]+)?\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'm');
  const match = content.match(regex);
  if (!match) {
    console.warn(`Export not found: ${exportName} in ${fileName}`);
    return [];
  }

  // Count items by matching { id: or slug: or similar object starts
  const block = match[1];
  const items = [];
  const objRegex = /\{[\s\S]*?(?:id|slug):\s*["']([^"']+)["'][\s\S]*?\}/g;
  let m;
  while ((m = objRegex.exec(block)) !== null) {
    items.push(m[0]);
  }
  return items;
}

// Let's also load the actual exported data using ts-node or custom parser
// Let's inspect tools, prompts, stories, festivals, kits, lexicon, blogs, videos, tutorials, workflows, comparisons, resources
const tools = countArrayItems('platform-data.ts', 'toolsData');
const videoEngines = countArrayItems('platform-data.ts', 'videoEnginesData');
const prompts = countArrayItems('platform-data.ts', 'promptsData');
const comparisons = countArrayItems('platform-data.ts', 'comparisonsData');
const tutorials = countArrayItems('platform-data.ts', 'tutorialsData');
const workflows = countArrayItems('platform-data.ts', 'workflowsData');
const blogs = countArrayItems('platform-data.ts', 'blogsData');
const videos = countArrayItems('platform-data.ts', 'videosData');
const resources = countArrayItems('platform-data.ts', 'resourcesData');
const stories = countArrayItems('production-stories.ts', 'storiesData');
const festivals = countArrayItems('festivals-data.ts', 'festivalsData');
const kits = countArrayItems('kits-data.ts', 'kitsData');
const lexicon = countArrayItems('lexicon-data.ts', 'cameraLexiconData');
const synced = countArrayItems('synced-content.ts', 'SYNCED_MASTER_CONTENT');

console.log('ACTUAL INVENTORY COUNTS IN REPOSITORY:');
console.log(`- Tools (platform-data.ts): ${tools.length}`);
console.log(`- Video Engines (platform-data.ts): ${videoEngines.length}`);
console.log(`- Prompts (platform-data.ts): ${prompts.length}`);
console.log(`- Comparisons (platform-data.ts): ${comparisons.length}`);
console.log(`- Tutorials / Guides (platform-data.ts): ${tutorials.length}`);
console.log(`- Workflows (platform-data.ts): ${workflows.length}`);
console.log(`- Blogs / Journal (platform-data.ts): ${blogs.length}`);
console.log(`- Videos (platform-data.ts): ${videos.length}`);
console.log(`- Resources (platform-data.ts): ${resources.length}`);
console.log(`- Production Stories (production-stories.ts): ${stories.length}`);
console.log(`- AI Film Festivals (festivals-data.ts): ${festivals.length}`);
console.log(`- Production Kits (kits-data.ts): ${kits.length}`);
console.log(`- Camera Lexicon (lexicon-data.ts): ${lexicon.length}`);
console.log(`- Synced Master Articles (synced-content.ts): ${synced.length}`);
