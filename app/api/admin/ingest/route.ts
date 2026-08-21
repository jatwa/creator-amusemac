import { NextResponse } from "next/server";
import path from "path";
import { contentImporter } from "@/lib/ingestion/importer";
import { contentValidator } from "@/lib/ingestion/validator";

export async function GET() {
  const importDir = path.join(process.cwd(), "data/import");
  const batchSummary = contentImporter.scanAndImportDirectory(importDir);

  return NextResponse.json({
    success: true,
    scannedAt: new Date().toISOString(),
    batchSummary,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entityType, records } = body;

    if (!entityType || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload. Expected { entityType: string, records: any[] }" },
        { status: 400 }
      );
    }

    const validationResults = contentValidator.validateBatch(entityType, records);
    const validCount = validationResults.filter((r) => r.valid).length;
    const invalidCount = validationResults.filter((r) => !r.valid).length;

    return NextResponse.json({
      success: true,
      entityType,
      totalProcessed: records.length,
      validCount,
      invalidCount,
      results: validationResults,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
