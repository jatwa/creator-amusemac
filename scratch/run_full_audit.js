const fs = require('fs');
const path = require('path');

// Helper to extract array lengths and slugs from ts content
function parseEntities(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  const extractArray = (varName) => {
    const regex = new RegExp(`export const ${varName}\\s*:\\s*\\w+\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'm');
    const match = content.match(regex);
    if (!match) return [];
    
    // Extract individual objects by id and slug
    const objRegex = /\{[\s\S]*?id:\s*["']([^"']+)["'][\s\S]*?slug:\s*["']([^"']+)["']/g;
    const items = [];
    let m;
    while ((m = objRegex.exec(match[1])) !== null) {
      items.push({ id: m[1], slug: m[2] });
    }
    return items;
  };

  const extractSimple = (varName) => {
    const regex = new RegExp(`export const ${varName}\\s*:\\s*\\w+\\[\\]\\s*=\\s*\\[([\\s\\S]*?)\\];`, 'm');
    const match = content.match(regex);
    if (!match) return [];
    const slugRegex = /slug:\s*["']([^"']+)["']/g;
    const slugs = [];
    let m;
    while ((m = slugRegex.exec(match[1])) !== null) {
      slugs.push(m[1]);
    }
    return slugs;
  };

  return {
    tools: extractArray('toolsData'),
    videoEngines: extractArray('videoEnginesData'),
    prompts: extractArray('promptsData'),
    comparisons: extractArray('comparisonsData'),
    tutorials: extractArray('tutorialsData'),
    workflows: extractArray('workflowsData'),
    blogs: extractArray('blogsData'),
    videos: extractArray('videosData'),
    categories: extractSimple('categoriesData'),
    resources: extractArray('resourcesData'),
  };
}

const baseline = parseEntities(path.join(__dirname, 'baseline-platform-data.ts'));
const current = parseEntities(path.join(__dirname, '../data/platform-data.ts'));

console.log('====================================================');
console.log('INVENTORY AUDIT: BASELINE (0b9a000) VS CURRENT (HEAD)');
console.log('====================================================\n');

const entities = ['tools', 'videoEngines', 'prompts', 'comparisons', 'tutorials', 'workflows', 'blogs', 'videos', 'categories', 'resources'];

let missingSlugs = [];

entities.forEach(ent => {
  const baseCount = baseline[ent].length;
  const currCount = current[ent].length;
  console.log(`${ent.toUpperCase()}:`);
  console.log(`  Baseline: ${baseCount}`);
  console.log(`  Current:  ${currCount}`);
  
  if (ent === 'categories') {
    const baseSlugs = baseline[ent];
    const currSlugs = current[ent];
    baseSlugs.forEach(s => {
      if (!currSlugs.includes(s)) {
        console.error(`  ❌ MISSING CATEGORY SLUG: ${s}`);
        missingSlugs.push({ entity: ent, slug: s });
      }
    });
  } else {
    const baseSlugs = baseline[ent].map(i => i.slug);
    const currSlugs = current[ent].map(i => i.slug);
    baseSlugs.forEach(s => {
      if (!currSlugs.includes(s)) {
        console.error(`  ❌ MISSING SLUG in ${ent}: ${s}`);
        missingSlugs.push({ entity: ent, slug: s });
      }
    });
  }
  console.log('');
});

console.log('Total Missing Slugs:', missingSlugs.length);

// Check duplicate IDs and duplicate Slugs in Current data
console.log('====================================================');
console.log('CHECKING FOR DUPLICATE IDS AND SLUGS IN CURRENT DATA');
console.log('====================================================\n');

let allIds = [];
let allSlugs = [];

entities.forEach(ent => {
  if (ent === 'categories') {
    current[ent].forEach(s => {
      if (allSlugs.includes(s)) console.error(`❌ Duplicate Slug found in categories: ${s}`);
      allSlugs.push(s);
    });
  } else {
    current[ent].forEach(item => {
      if (allIds.includes(item.id)) console.error(`❌ Duplicate ID found in ${ent}: ${item.id}`);
      if (allSlugs.includes(item.slug)) console.error(`❌ Duplicate Slug found in ${ent}: ${item.slug}`);
      allIds.push(item.id);
      allSlugs.push(item.slug);
    });
  }
});

console.log('Duplicate check completed.');
fs.writeFileSync(path.join(__dirname, 'audit_results.json'), JSON.stringify({ baseline, current, missingSlugs }, null, 2));
