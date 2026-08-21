import path from "path";
import { contentImporter } from "../lib/ingestion/importer";

console.log("====================================================");
console.log("CREATOR BY AMUSEMAC — CONTENT INGESTION PIPELINE");
console.log("====================================================\n");

const importDir = path.join(__dirname, "../data/import");
console.log(`Scanning import directory: ${importDir}\n`);

const summary = contentImporter.scanAndImportDirectory(importDir);

let grandTotalProcessed = 0;
let grandTotalValid = 0;
let grandTotalInvalid = 0;

Object.entries(summary).forEach(([fileKey, batchResult]) => {
  console.log(`\n--- BATCH: ${fileKey} ---`);
  console.log(`Processed: ${batchResult.totalProcessed} | Valid: ${batchResult.totalValid} | Invalid: ${batchResult.totalInvalid}`);
  
  grandTotalProcessed += batchResult.totalProcessed;
  grandTotalValid += batchResult.totalValid;
  grandTotalInvalid += batchResult.totalInvalid;

  batchResult.results.forEach((res) => {
    const symbol = res.valid ? "✓" : "✗";
    console.log(`  ${symbol} [${res.entityType}] ${res.recordSlug || res.recordId || "unknown"}`);
    if (res.errors.length > 0) {
      res.errors.forEach((err) => console.log(`      Error: ${err}`));
    }
    if (res.warnings.length > 0) {
      res.warnings.forEach((warn) => console.log(`      Warning: ${warn}`));
    }
  });
});

console.log("\n====================================================");
console.log("INGESTION SCAN SUMMARY:");
console.log(`Total Files Scanned: ${Object.keys(summary).length}`);
console.log(`Total Records Processed: ${grandTotalProcessed}`);
console.log(`Total Valid Records: ${grandTotalValid}`);
console.log(`Total Invalid Records: ${grandTotalInvalid}`);
console.log("====================================================");
