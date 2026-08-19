import { NextRequest, NextResponse } from "next/server";
import { testLivePipeline } from "@/lib/engine/pipeline-test";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Enforce ADMIN_SECRET in production or when configured
  const adminSecret = process.env.ADMIN_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd && !adminSecret) {
    return NextResponse.json(
      { error: "Server Configuration Error: ADMIN_SECRET is not configured in production." },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const customSecret = request.headers.get("x-admin-secret");

  if (
    adminSecret &&
    customSecret !== adminSecret &&
    authHeader !== `Bearer ${adminSecret}`
  ) {
    return NextResponse.json({ error: "Unauthorized: Invalid admin credentials." }, { status: 401 });
  }
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
