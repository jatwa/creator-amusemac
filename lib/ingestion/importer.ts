import fs from "fs";
import path from "path";
import { contentValidator } from "./validator";
import { IngestionBatchResult, IngestionValidationResult } from "./types";

export class ContentImporter {
  public importJsonFile(entityType: string, filePath: string): IngestionBatchResult {
    const rawData = fs.readFileSync(filePath, "utf8");
    let records: any[] = [];
    
    try {
      const parsed = JSON.parse(rawData);
      records = Array.isArray(parsed) ? parsed : [parsed];
    } catch (e: any) {
      return {
        totalProcessed: 0,
        totalValid: 0,
        totalInvalid: 1,
        results: [
          {
            valid: false,
            errors: [`JSON Parse Error in ${path.basename(filePath)}: ${e.message}`],
            warnings: [],
            entityType,
          },
        ],
        importedAt: new Date().toISOString(),
      };
    }

    const validationResults = contentValidator.validateBatch(entityType, records);
    const totalValid = validationResults.filter((r) => r.valid).length;
    const totalInvalid = validationResults.filter((r) => !r.valid).length;

    return {
      totalProcessed: records.length,
      totalValid,
      totalInvalid,
      results: validationResults,
      importedAt: new Date().toISOString(),
    };
  }

  public parseCsvString(csvText: string): any[] {
    const lines = csvText.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    const records: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parser handling quotes
      const values: string[] = [];
      let inQuotes = false;
      let currentValue = "";

      for (let char of line) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim().replace(/^"|"$/g, ""));
          currentValue = "";
        } else {
          currentValue += char;
        }
      }
      values.push(currentValue.trim().replace(/^"|"$/g, ""));

      const recordObj: Record<string, any> = {};
      headers.forEach((header, idx) => {
        const val = values[idx] || "";
        // Auto-parse arrays if pipe or semicolon delimited
        if (val.includes("|") || val.includes(";")) {
          recordObj[header] = val.split(/[|;]/).map((s) => s.trim());
        } else if (val.toLowerCase() === "true") {
          recordObj[header] = true;
        } else if (val.toLowerCase() === "false") {
          recordObj[header] = false;
        } else {
          recordObj[header] = val;
        }
      });
      records.push(recordObj);
    }

    return records;
  }

  public importCsvFile(entityType: string, filePath: string): IngestionBatchResult {
    const rawData = fs.readFileSync(filePath, "utf8");
    const records = this.parseCsvString(rawData);

    const validationResults = contentValidator.validateBatch(entityType, records);
    const totalValid = validationResults.filter((r) => r.valid).length;
    const totalInvalid = validationResults.filter((r) => !r.valid).length;

    return {
      totalProcessed: records.length,
      totalValid,
      totalInvalid,
      results: validationResults,
      importedAt: new Date().toISOString(),
    };
  }

  public scanAndImportDirectory(importBaseDir: string): Record<string, IngestionBatchResult> {
    const batchSummary: Record<string, IngestionBatchResult> = {};
    if (!fs.existsSync(importBaseDir)) {
      return batchSummary;
    }

    const subdirs = fs.readdirSync(importBaseDir);
    for (const subdir of subdirs) {
      const entityPath = path.join(importBaseDir, subdir);
      if (fs.statSync(entityPath).isDirectory()) {
        const files = fs.readdirSync(entityPath);
        for (const file of files) {
          const fullFilePath = path.join(entityPath, file);
          if (file.endsWith(".json")) {
            const res = this.importJsonFile(subdir, fullFilePath);
            batchSummary[`${subdir}/${file}`] = res;
          } else if (file.endsWith(".csv")) {
            const res = this.importCsvFile(subdir, fullFilePath);
            batchSummary[`${subdir}/${file}`] = res;
          }
        }
      }
    }

    return batchSummary;
  }
}

export const contentImporter = new ContentImporter();
