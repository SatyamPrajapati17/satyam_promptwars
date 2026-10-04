import { NextRequest } from "next/server";
import { ok, err, handleApiError } from "@/lib/api/respond";
import { publicEnv, serverEnv } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";
import nodemailer from "nodemailer";
import { google } from "googleapis";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ service: string }> }
) {
  const { service } = await params;

  try {
    const startTime = Date.now();

    switch (service) {
      case "supabase": {
        const missing: string[] = [];
        if (!publicEnv.NEXT_PUBLIC_SUPABASE_URL)
          missing.push("NEXT_PUBLIC_SUPABASE_URL");
        if (!publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
          missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
        if (!serverEnv.SUPABASE_SECRET_KEY)
          missing.push("SUPABASE_SECRET_KEY");

        if (missing.length > 0) {
          return err(
            "integration_not_configured",
            `Missing Supabase keys: ${missing.join(", ")}`,
            400,
            { missing }
          );
        }

        const supabase = createAdminClient();
        const { error } = await supabase
          .from("profiles")
          .select("id", { count: "exact", head: true });

        if (error) {
          return err("internal", `Supabase query failed: ${error.message}`, 500);
        }

        return ok({
          status: "connected",
          service: "Supabase",
          latencyMs: Date.now() - startTime,
        });
      }

      case "ai": {
        if (!serverEnv.NVIDIA_API_KEY) {
          return err(
            "integration_not_configured",
            "Missing NVIDIA_API_KEY",
            400,
            { missing: ["NVIDIA_API_KEY"] }
          );
        }

        const res = await fetch(`${serverEnv.NVIDIA_BASE_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${serverEnv.NVIDIA_API_KEY}`,
          },
          body: JSON.stringify({
            model: serverEnv.NVIDIA_MODEL,
            messages: [{ role: "user", content: "Ping" }],
            max_tokens: 2,
          }),
        });

        if (!res.ok) {
          const body = await res.text().catch(() => "");
          return err(
            "ai_failed",
            `NVIDIA API returned HTTP ${res.status}: ${body.slice(0, 150)}`,
            res.status
          );
        }

        return ok({
          status: "connected",
          service: "NVIDIA AI",
          model: serverEnv.NVIDIA_MODEL,
          latencyMs: Date.now() - startTime,
        });
      }

      case "gmail": {
        const missing: string[] = [];
        if (!serverEnv.GMAIL_USER) missing.push("GMAIL_USER");
        if (!serverEnv.GMAIL_APP_PASSWORD) missing.push("GMAIL_APP_PASSWORD");

        if (missing.length > 0) {
          return err(
            "integration_not_configured",
            `Missing Gmail credentials: ${missing.join(", ")}`,
            400,
            { missing }
          );
        }

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: serverEnv.GMAIL_USER,
            pass: serverEnv.GMAIL_APP_PASSWORD.replace(/\s+/g, ""),
          },
        });

        await transporter.verify();

        return ok({
          status: "connected",
          service: "Gmail SMTP",
          user: serverEnv.GMAIL_USER,
          latencyMs: Date.now() - startTime,
        });
      }

      case "sheets": {
        const missing: string[] = [];
        if (!serverEnv.GOOGLE_SHEETS_CLIENT_EMAIL)
          missing.push("GOOGLE_SHEETS_CLIENT_EMAIL");
        if (!serverEnv.GOOGLE_SHEETS_PRIVATE_KEY)
          missing.push("GOOGLE_SHEETS_PRIVATE_KEY");
        if (!serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID)
          missing.push("GOOGLE_SHEETS_SPREADSHEET_ID");

        if (missing.length > 0) {
          return err(
            "integration_not_configured",
            `Missing Google Sheets credentials: ${missing.join(", ")}`,
            400,
            { missing }
          );
        }

        const cleanKey = serverEnv.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n");
        const auth = new google.auth.JWT({
          email: serverEnv.GOOGLE_SHEETS_CLIENT_EMAIL,
          key: cleanKey,
          scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const metadata = await sheets.spreadsheets.get({
          spreadsheetId: serverEnv.GOOGLE_SHEETS_SPREADSHEET_ID,
        });

        return ok({
          status: "connected",
          service: "Google Sheets",
          title: metadata.data.properties?.title || "Spreadsheet",
          latencyMs: Date.now() - startTime,
        });
      }

      default:
        return err("not_found", `Unknown integration service: ${service}`, 404);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
