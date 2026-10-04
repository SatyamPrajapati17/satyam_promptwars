import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { getDecisionById, saveDecision } from "@/lib/db/decisions";
import { runDecisionAudit } from "@/lib/ai/audit";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    const decision = await getDecisionById(id, user.id);

    if (!decision) {
      return NextResponse.json(
        { ok: false, error: { code: "not_found", message: "Decision not found" } },
        { status: 404 }
      );
    }

    // Run the AI audit
    const auditResult = await runDecisionAudit(decision);

    // Merge audited results into decision
    const updated = {
      ...decision,
      status: "audited" as const,
      blind_spots: auditResult.blind_spots,
      premortem_items: auditResult.premortem_items,
      actions: [...decision.actions, ...auditResult.actions],
      readiness_score: auditResult.readiness_score,
      ai_summary: auditResult.ai_summary,
      updated_at: new Date().toISOString(),
    };

    const saved = await saveDecision(updated);

    return NextResponse.json({ ok: true, data: saved });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
