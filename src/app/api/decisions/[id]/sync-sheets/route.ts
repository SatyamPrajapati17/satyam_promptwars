import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api/auth-helper";
import { getDecisionById } from "@/lib/db/decisions";

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

    const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
      return NextResponse.json({
        ok: true,
        data: {
          synced: false,
          reason: "Google Sheets service account not configured yet in environment.",
          row: [
            decision.id,
            decision.category,
            decision.stakes,
            decision.reversibility,
            decision.readiness_score,
            decision.blind_spots.length,
            decision.actions.length,
            decision.status,
            decision.created_at,
          ],
        },
      });
    }

    // Dynamic import googleapis
    const { google } = await import("googleapis");
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:I",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            decision.id,
            decision.category,
            decision.stakes,
            decision.reversibility,
            decision.readiness_score,
            decision.blind_spots.length,
            decision.actions.length,
            decision.status,
            decision.created_at,
          ],
        ],
      },
    });

    return NextResponse.json({ ok: true, data: { synced: true, spreadsheetId: sheetId } });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: { code: "internal", message: error.message } },
      { status: 500 }
    );
  }
}
