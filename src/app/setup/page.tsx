"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Chip } from "@/components/brutal/Chip";
import { Database, Cpu, Mail, FileSpreadsheet, ShieldAlert, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function SetupPage() {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({
    supabase: false,
    ai: false,
    sheets: false,
    gmail: false,
  });
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState<
    Record<string, { testing: boolean; ok?: boolean; message?: string; latency?: number }>
  >({});

  const checkHealth = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setStatuses({
        supabase: Boolean(data.supabase),
        ai: Boolean(data.ai),
        sheets: Boolean(data.sheets),
        gmail: Boolean(data.gmail),
      });
    } catch {
      // Keep false on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const runTest = async (service: string) => {
    setTestResults((prev) => ({
      ...prev,
      [service]: { testing: true },
    }));

    try {
      const res = await fetch(`/api/setup/test/${service}`, { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        setTestResults((prev) => ({
          ...prev,
          [service]: {
            testing: false,
            ok: true,
            message: `Connected successfully (${data.data.latencyMs}ms)`,
            latency: data.data.latencyMs,
          },
        }));
      } else {
        setTestResults((prev) => ({
          ...prev,
          [service]: {
            testing: false,
            ok: false,
            message: data.error?.message || "Test failed",
          },
        }));
      }
    } catch (e: unknown) {
      setTestResults((prev) => ({
        ...prev,
        [service]: {
          testing: false,
          ok: false,
          message: e instanceof Error ? e.message : "Connection failed",
        },
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2.5 py-1 border border-black shadow-[2px_2px_0_#000]">
              SYSTEM HEALTH &amp; INTEGRATIONS
            </span>
            <h1
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-2"
              style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
            >
              WORKSPACE SETUP
            </h1>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={checkHealth}
            icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
          >
            Refresh Status
          </Button>
        </div>

        <Card className="border-[4px] border-black bg-yellow-50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#FFE600] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0_#000]">
              <ShieldAlert className="w-6 h-6 text-black" />
            </div>
            <div className="space-y-1">
              <h2 className="font-black text-lg uppercase tracking-wide">
                Key Handoff Protocol
              </h2>
              <p className="text-sm font-medium text-gray-800 leading-relaxed">
                The Unbias runs on localhost first without keys. Once running, you can connect your
                four credentials (Supabase, NVIDIA, Gmail, Sheets) into your local <code className="bg-black text-[#FFE600] px-1 py-0.5 font-mono text-xs">.env.local</code>.
                Keys are never logged, never exposed to client browsers, and never committed to git.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Supabase */}
          <Card hover className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-black" />
                  <h3 className="font-black text-lg uppercase">1. Supabase (Auth + DB)</h3>
                </div>
                {statuses.supabase ? (
                  <Chip variant="green">CONFIGURED</Chip>
                ) : (
                  <Chip variant="red">NOT CONNECTED</Chip>
                )}
              </div>

              <p className="text-xs text-gray-700 mt-2">
                PostgreSQL storage with Row Level Security, password signup, magic links, and audit history.
              </p>

              <div className="mt-3 bg-gray-50 border-2 border-black p-2 font-mono text-[11px] text-gray-800 space-y-1">
                <div>Required in .env.local:</div>
                <div className="text-black font-bold">• NEXT_PUBLIC_SUPABASE_URL</div>
                <div className="text-black font-bold">• NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</div>
                <div className="text-black font-bold">• SUPABASE_SECRET_KEY</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => runTest("supabase")}
                  isLoading={testResults.supabase?.testing}
                >
                  Test Supabase
                </Button>
                {testResults.supabase && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {testResults.supabase.ok ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Connected ({testResults.supabase.latency}ms)
                      </span>
                    ) : (
                      <span className="text-[#E10600] flex items-center gap-1 truncate max-w-[200px]" title={testResults.supabase.message}>
                        <XCircle className="w-4 h-4 shrink-0" /> {testResults.supabase.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 2. NVIDIA AI NIM */}
          <Card hover className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-black" />
                  <h3 className="font-black text-lg uppercase">2. NVIDIA AI (Server-Side)</h3>
                </div>
                {statuses.ai ? (
                  <Chip variant="green">CONFIGURED</Chip>
                ) : (
                  <Chip variant="red">NOT CONNECTED</Chip>
                )}
              </div>

              <p className="text-xs text-gray-700 mt-2">
                OpenAI-compatible inference endpoint for extracting reasoning maps, blind-spot cards, and pre-mortem risks.
              </p>

              <div className="mt-3 bg-gray-50 border-2 border-black p-2 font-mono text-[11px] text-gray-800 space-y-1">
                <div>Required in .env.local:</div>
                <div className="text-black font-bold">• NVIDIA_API_KEY</div>
                <div className="text-gray-600 font-bold">• NVIDIA_MODEL (default meta/llama-3.3-70b-instruct)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => runTest("ai")}
                  isLoading={testResults.ai?.testing}
                >
                  Test AI NIM
                </Button>
                {testResults.ai && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {testResults.ai.ok ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Connected ({testResults.ai.latency}ms)
                      </span>
                    ) : (
                      <span className="text-[#E10600] flex items-center gap-1 truncate max-w-[200px]" title={testResults.ai.message}>
                        <XCircle className="w-4 h-4 shrink-0" /> {testResults.ai.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 3. Gmail (Nodemailer) */}
          <Card hover className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-black" />
                  <h3 className="font-black text-lg uppercase">3. Gmail SMTP</h3>
                </div>
                {statuses.gmail ? (
                  <Chip variant="green">CONFIGURED</Chip>
                ) : (
                  <Chip variant="red">NOT CONNECTED</Chip>
                )}
              </div>

              <p className="text-xs text-gray-700 mt-2">
                Sends Decision Reports and revisit deadline reminders with Brutalist HTML templates.
              </p>

              <div className="mt-3 bg-gray-50 border-2 border-black p-2 font-mono text-[11px] text-gray-800 space-y-1">
                <div>Required in .env.local:</div>
                <div className="text-black font-bold">• GMAIL_USER (your-email@gmail.com)</div>
                <div className="text-black font-bold">• GMAIL_APP_PASSWORD (16 chars, no spaces)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => runTest("gmail")}
                  isLoading={testResults.gmail?.testing}
                >
                  Test Gmail SMTP
                </Button>
                {testResults.gmail && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {testResults.gmail.ok ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Connected ({testResults.gmail.latency}ms)
                      </span>
                    ) : (
                      <span className="text-[#E10600] flex items-center gap-1 truncate max-w-[200px]" title={testResults.gmail.message}>
                        <XCircle className="w-4 h-4 shrink-0" /> {testResults.gmail.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* 4. Google Sheets API */}
          <Card hover className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-black" />
                  <h3 className="font-black text-lg uppercase">4. Google Sheets (Mirror)</h3>
                </div>
                {statuses.sheets ? (
                  <Chip variant="green">CONFIGURED</Chip>
                ) : (
                  <Chip variant="red">NOT CONNECTED</Chip>
                )}
              </div>

              <p className="text-xs text-gray-700 mt-2">
                Asynchronous write-only mirror for anonymized metrics, hashes, and completion milestones.
              </p>

              <div className="mt-3 bg-gray-50 border-2 border-black p-2 font-mono text-[11px] text-gray-800 space-y-1">
                <div>Required in .env.local:</div>
                <div className="text-black font-bold">• GOOGLE_SHEETS_CLIENT_EMAIL</div>
                <div className="text-black font-bold">• GOOGLE_SHEETS_PRIVATE_KEY</div>
                <div className="text-black font-bold">• GOOGLE_SHEETS_SPREADSHEET_ID</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => runTest("sheets")}
                  isLoading={testResults.sheets?.testing}
                >
                  Test Sheets API
                </Button>
                {testResults.sheets && (
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    {testResults.sheets.ok ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" /> Connected ({testResults.sheets.latency}ms)
                      </span>
                    ) : (
                      <span className="text-[#E10600] flex items-center gap-1 truncate max-w-[200px]" title={testResults.sheets.message}>
                        <XCircle className="w-4 h-4 shrink-0" /> {testResults.sheets.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

