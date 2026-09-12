const fs = require('fs');
const path = require('path');

// Extract toolsData and test all fields
const platformData = fs.readFileSync(path.join(__dirname, '../data/platform-data.ts'), 'utf8');

// Parse toolsData array
const toolsDataMatch = platformData.match(/export const toolsData\s*:\s*Tool\[\]\s*=\s*(\[[\s\S]*?\]);\s*export const promptsData/);
if (!toolsDataMatch) {
  console.error('Could not extract toolsData');
  process.exit(1);
}

// Evaluate toolsData safely in a sandboxed context
const tools = eval(toolsDataMatch[1]);
console.log(`Auditing ${tools.length} Tools...`);

const missingFields = [];

tools.forEach((t, idx) => {
  const issues = [];
  if (!t.name) issues.push('name');
  if (!t.slug) issues.push('slug');
  if (!t.category) issues.push('category');
  if (!t.officialUrl) issues.push('officialUrl');
  if (!t.sourceUrl && !t.officialUrl) issues.push('sourceUrl/officialUrl');
  if (!t.verifiedAt) issues.push('verifiedAt');
  
  if (issues.length > 0) {
    console.error(`❌ Tool #${idx + 1} (${t.name || 'unnamed'}): Missing ${issues.join(', ')}`);
    missingFields.push({ tool: t.name || t.slug, issues });
  }
});

console.log(`Tool field audit completed. Total issues: ${missingFields.length}`);
fs.writeFileSync(path.join(__dirname, 'tool_field_audit.json'), JSON.stringify(missingFields, null, 2));
