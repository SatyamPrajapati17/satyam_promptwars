import { NextResponse } from "next/server";
import { isConfigured } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const supabase = isConfigured("supabase");
  const ai = isConfigured("ai");
  const sheets = isConfigured("sheets");
  const gmail = isConfigured("gmail");

  return NextResponse.json({
    ok: true,
    supabase,
    ai,
    sheets,
    gmail,
  });
}
