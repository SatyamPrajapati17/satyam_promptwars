"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Server,
  Mail,
  Cpu,
  FileSpreadsheet,
  Download,
  Shield,
} from "lucide-react";

export default function SettingsPage() {
  const [testingAi, setTestingAi] = useState(false);
  const [testingGmail, setTestingGmail] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleTestAi = async () => {
    setTestingAi(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/setup/test/ai", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setTestResult("✅ NVIDIA NIM AI: Test completion succeeded!");
      } else {
        setTestResult(`❌ AI test failed: ${json.error?.message}`);
      }
    } catch (e: any) {
      setTestResult(`❌ Exception: ${e.message}`);
    } finally {
      setTestingAi(false);
    }
  };

  const handleTestGmail = async () => {
    setTestingGmail(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/setup/test/gmail", { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        setTestResult("✅ Gmail SMTP: Connection verified and test email dispatched!");
      } else {
        setTestResult(`❌ Gmail test failed: ${json.error?.message}`);
      }
    } catch (e: any) {
      setTestResult(`❌ Exception: ${e.message}`);
    } finally {
      setTestingGmail(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await fetch("/api/decisions");
      const json = await res.json();
      const blob = new Blob([JSON.stringify(json.data || [], null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `the-unbias-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export decisions.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#E10600]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2 py-1">
          SETTINGS & INTEGRATIONS
        </span>
      </div>

      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
        <h1 className="text-3xl font-black uppercase tracking-tight font-display">
          SYSTEM HEALTH & INTEGRATIONS
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Verify connected services and manage your decision audit workspace data.
        </p>
      </div>

      {testResult && (
        <div className="p-4 bg-white border-3 border-black shadow-[4px_4px_0_#000] font-mono text-xs font-bold">
          {testResult}
        </div>
      )}

      {/* Integration Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NVIDIA NIM */}
        <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black uppercase">
              <Cpu className="w-5 h-5 text-black" /> NVIDIA AI NIM
            </div>
            <span className="bg-green-100 text-green-900 font-mono text-[11px] font-bold px-2 py-0.5 border border-green-800 uppercase">
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-gray-700">
            Model: <code className="bg-gray-100 px-1 py-0.5 font-bold">openai/gpt-oss-20b</code>
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            Powers the 6 cognitive audit lenses, pre-mortem simulations, and blind-spot triage.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestAi}
              disabled={testingAi}
              className="w-full"
            >
              {testingAi ? "TESTING PING..." : "RUN AI TEST PING"}
            </Button>
          </div>
        </Card>

        {/* Gmail SMTP */}
        <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black uppercase">
              <Mail className="w-5 h-5 text-[#E10600]" /> GMAIL SMTP
            </div>
            <span className="bg-green-100 text-green-900 font-mono text-[11px] font-bold px-2 py-0.5 border border-green-800 uppercase">
              CONFIGURED
            </span>
          </div>
          <p className="text-xs text-gray-700">
            User: <code className="bg-gray-100 px-1 py-0.5 font-bold">satyamprajapati8976@gmail.com</code>
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            Dispatches decision audit reports, email verifications, and scheduled reminders.
          </p>
          <div className="pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTestGmail}
              disabled={testingGmail}
              className="w-full"
            >
              {testingGmail ? "VERIFYING..." : "SEND TEST EMAIL"}
            </Button>
          </div>
        </Card>

        {/* Supabase */}
        <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black uppercase">
              <Server className="w-5 h-5 text-emerald-600" /> SUPABASE
            </div>
            <span className="bg-green-100 text-green-900 font-mono text-[11px] font-bold px-2 py-0.5 border border-green-800 uppercase">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-gray-700">
            Project: <code className="bg-gray-100 px-1 py-0.5 font-bold">tfmwflmneraajvdjkjul</code>
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            Postgres database + Cookie-based PKCE Authentication.
          </p>
        </Card>

        {/* Google Sheets */}
        <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black uppercase">
              <FileSpreadsheet className="w-5 h-5 text-green-600" /> GOOGLE SHEETS
            </div>
            <span className="bg-yellow-100 text-yellow-900 font-mono text-[11px] font-bold px-2 py-0.5 border border-yellow-800 uppercase">
              TARGET SET
            </span>
          </div>
          <p className="text-xs text-gray-700 truncate">
            ID: <code className="bg-gray-100 px-1 py-0.5 font-bold">1rdoSHBg...</code>
          </p>
          <p className="text-[11px] text-gray-500 font-mono">
            Mirrors anonymized readiness scores and category metrics for hackathon verification.
          </p>
        </Card>
      </div>

      {/* Data Export & Privacy */}
      <Card variant="default" className="p-6 md:p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
        <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
          <Shield className="w-5 h-5 text-black" /> DATA PRIVACY & AUDIT PORTABILITY
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed">
          The Unbias operates with zero retention on third-party model training. You own all decisions, reasoning maps, and pre-mortem items. Download your complete decision database at any time.
        </p>

        <div className="pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> EXPORT ALL DECISIONS (.JSON)
          </Button>
        </div>
      </Card>
    </div>
  );
}
