import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { getDecisions, saveDecision, Decision } from "@/lib/db/decisions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthUser();
    const decisions = await getDecisions(user.id);
    return NextResponse.json({ ok: true, data: decisions });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    const body = await request.json();

    const newDecision: Decision = {
      id: "dec-" + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      title: body.title || "Untitled Decision",
      category: body.category || "business",
      stakes: body.stakes || "medium",
      reversibility: body.reversibility || "two_way_door",
      deadline: body.deadline || null,
      status: "draft",
      emotional_state: body.emotional_state || { stress_level: 5 },
      options: body.options || [],
      reasons: body.reasons || [],
      blind_spots: [],
      premortem_items: [],
      actions: [],
      readiness_score: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = await saveDecision(newDecision);
    return NextResponse.json({ ok: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
