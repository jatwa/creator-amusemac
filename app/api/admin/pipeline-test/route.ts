import { NextResponse } from "next/server";
import { testLivePipeline } from "@/lib/engine/pipeline-test";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = testLivePipeline();
    return NextResponse.json({
      success: result.allPassed,
      lifecyclePassed: result.allPassed,
      steps: {
        initialState: result.step1,
        sourceIngestion: result.step2,
        changeDetection: result.step2,
        updateStaging: result.step3,
        adminApproval: result.step4,
        databaseState: result.step5,
        rollbackExecution: result.step6,
        restorationVerified: result.step7,
      },
      auditLog: result.details,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
