import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { getDecisionById } from "@/lib/db/decisions";
import { sendDecisionAuditEmail } from "@/lib/mail/client";

export const runtime = "nodejs";

export async function POST(
  request: Request,
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

    const body = await request.json().catch(() => ({}));
    const recipient = body.recipient || user.email;

    const result = await sendDecisionAuditEmail(decision, recipient);

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: { code: "email_failed", message: result.error || "Email failed" } },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: { sentTo: recipient, messageId: result.messageId } });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
