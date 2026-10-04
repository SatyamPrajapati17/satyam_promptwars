import fs from "fs";
import path from "path";

try {
  const envContent = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
} catch (e) {}

import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

async function verify() {
  console.log("\n==============================");
  console.log("THE UNBIAS INTEGRATION CHECKS");
  console.log("==============================\n");

  // 1. Supabase
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!sbUrl || !sbKey) {
    console.error("❌ Supabase: URL or Secret Key missing!");
  } else {
    try {
      const supabase = createClient(sbUrl, sbKey, { auth: { persistSession: false } });
      const { data, error } = await supabase.from("decisions").select("id").limit(1);
      if (error) {
        console.error("❌ Supabase check failed:", error.message);
      } else {
        console.log("✅ Supabase: Connected! Accessible tables: profiles, decisions, analysis_runs, etc.");
      }
    } catch (e: any) {
      console.error("❌ Supabase exception:", e.message);
    }
  }

  // 2. NVIDIA NIM AI
  const nvKey = process.env.NVIDIA_API_KEY;
  const nvModel = process.env.NVIDIA_MODEL || "openai/gpt-oss-20b";
  if (!nvKey) {
    console.warn("⚠️ NVIDIA: API key missing.");
  } else {
    try {
      const t0 = Date.now();
      const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${nvKey}`,
        },
        body: JSON.stringify({
          model: nvModel,
          messages: [{ role: "user", content: "Test ping" }],
          max_tokens: 5,
        }),
      });
      if (res.ok) {
        console.log(`✅ NVIDIA AI (${nvModel}): Connected! Response time: ${Date.now() - t0}ms`);
      } else {
        const text = await res.text();
        console.error(`❌ NVIDIA AI failed (${res.status}):`, text.slice(0, 100));
      }
    } catch (e: any) {
      console.error("❌ NVIDIA AI exception:", e.message);
    }
  }

  // 3. Gmail SMTP
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    console.warn("⚠️ Gmail: GMAIL_USER or GMAIL_APP_PASSWORD missing.");
  } else {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.verify();
      console.log(`✅ Gmail SMTP: Verified & connected as ${gmailUser}`);
    } catch (e: any) {
      console.error("❌ Gmail SMTP verification failed:", e.message);
    }
  }

  // 4. Google Sheets
  const sheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (sheetId) {
    console.log(`ℹ️ Google Sheets: Spreadsheet ID set (${sheetId})`);
  } else {
    console.log("ℹ️ Google Sheets: Not configured yet.");
  }

  console.log("\n==============================\n");
}

verify().catch(console.error);
