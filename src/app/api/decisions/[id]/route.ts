import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { getDecisionById, saveDecision, deleteDecision } from "@/lib/db/decisions";

export const runtime = "nodejs";

export async function GET(
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

    return NextResponse.json({ ok: true, data: decision });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    const existing = await getDecisionById(id, user.id);

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: { code: "not_found", message: "Decision not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      user_id: existing.user_id,
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    await deleteDecision(id, user.id);
    return NextResponse.json({ ok: true, data: { deleted: true } });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
