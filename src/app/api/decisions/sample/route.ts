import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { saveDecision } from "@/lib/db/decisions";
import { generateSampleDecision } from "@/lib/db/sample";

export const runtime = "nodejs";

export async function POST() {
  try {
    const user = await getAuthUser();
    const sample = generateSampleDecision(user.id);
    const saved = await saveDecision(sample);
    return NextResponse.json({ ok: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
