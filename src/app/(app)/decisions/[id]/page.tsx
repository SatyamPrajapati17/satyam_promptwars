"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Chip } from "@/components/brutal/Chip";
import { ProgressRing } from "@/components/brutal/ProgressRing";
import { ConfidenceMeter } from "@/components/brutal/ConfidenceMeter";
import { Decision, BlindSpotCard, PremortemItem, EvidenceAction } from "@/lib/db/decisions";
import {
  ArrowLeft,
  Sparkles,
  Mail,
  FileText,
  Share2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Brain,
  ListTodo,
  Columns,
  RefreshCw,
  Send,
  Database,
  Printer,
} from "lucide-react";

export default function DecisionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [syncingSheets, setSyncingSheets] = useState(false);
  const [sheetsMessage, setSheetsMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "blind_spots" | "premortem" | "actions" | "options">("all");

  const loadDecision = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/decisions/${id}`);
      const json = await res.json();
      if (json.ok && json.data) {
        setDecision(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadDecision();
  }, [id]);

  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch(`/api/decisions/${id}/analyze`, { method: "POST" });
      const json = await res.json();
      if (json.ok && json.data) {
        setDecision(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAuditing(false);
    }
  };

  const handleUpdateActionStatus = async (actionId: string, newStatus: "todo" | "in_progress" | "done") => {
    if (!decision) return;
    const updatedActions = decision.actions.map((act) =>
      act.id === actionId ? { ...act, status: newStatus } : act
    );
    const updatedDecision = { ...decision, actions: updatedActions };
    setDecision(updatedDecision);

    try {
      await fetch(`/api/decisions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actions: updatedActions }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBlindSpotStatus = async (cardId: string) => {
    if (!decision) return;
    const updatedCards = decision.blind_spots.map((c) =>
      c.id === cardId ? { ...c, status: (c.status === "open" ? "addressed" : "open") as "open" | "addressed" } : c
    );
    const updatedDecision = { ...decision, blind_spots: updatedCards };
    setDecision(updatedDecision);

    try {
      await fetch(`/api/decisions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blind_spots: updatedCards }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailStatus(null);
    try {
      const res = await fetch(`/api/decisions/${id}/report/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: recipientEmail || undefined }),
      });
      const json = await res.json();
      if (json.ok) {
        setEmailStatus(`Report successfully delivered via Gmail to ${json.data.sentTo}!`);
        setTimeout(() => {
          setEmailModalOpen(false);
          setEmailStatus(null);
        }, 3000);
      } else {
        setEmailStatus(`Failed to send email: ${json.error?.message || "Check SMTP settings"}`);
      }
    } catch (e: any) {
      setEmailStatus(`Exception: ${e.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleSyncSheets = async () => {
    setSyncingSheets(true);
    setSheetsMessage(null);
    try {
      const res = await fetch(`/api/decisions/${id}/sync-sheets`, { method: "POST" });
      const json = await res.json();
      if (json.ok) {
        if (json.data.synced) {
          setSheetsMessage("✅ Successfully mirrored row into Google Sheets!");
        } else {
          setSheetsMessage(`ℹ️ Telemetry prepared. (${json.data.reason})`);
        }
      }
    } catch (e: any) {
      setSheetsMessage(`Sheets sync error: ${e.message}`);
    } finally {
      setSyncingSheets(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center font-mono font-bold bg-white border-4 border-black">
        RETRIEVING DECISION AUDIT...
      </div>
    );
  }

  if (!decision) {
    return (
      <div className="p-12 text-center bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
        <h2 className="text-2xl font-black uppercase font-display">DECISION NOT FOUND</h2>
        <Button href="/dashboard" variant="primary" size="md">
          RETURN TO DASHBOARD
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back and Subtitle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#E10600] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decisions
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSyncSheets}
            disabled={syncingSheets}
            className="flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            {syncingSheets ? "SYNCING..." : "SYNC SHEETS"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" /> EMAIL AUDIT
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunAudit}
            disabled={auditing}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${auditing ? "animate-spin" : ""}`} />
            {auditing ? "AUDITING..." : "RE-TEST AUDIT"}
          </Button>
        </div>
      </div>

      {sheetsMessage && (
        <div className="p-3 bg-yellow-100 border-2 border-black font-mono text-xs font-bold flex items-center justify-between">
          <span>{sheetsMessage}</span>
          <button onClick={() => setSheetsMessage(null)} className="text-black hover:text-[#E10600]">
            ✕
          </button>
        </div>
      )}

      {/* Main Command Header */}
      <Card variant="default" className="p-6 md:p-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-black text-[#FFE600] font-mono font-bold text-xs px-2.5 py-0.5 uppercase">
                {decision.category}
              </span>
              <span
                className={`font-mono font-bold text-xs px-2.5 py-0.5 uppercase border border-black ${
                  decision.stakes === "critical"
                    ? "bg-[#E10600] text-white"
                    : decision.stakes === "high"
                    ? "bg-red-100 text-[#E10600]"
                    : "bg-gray-100 text-black"
                }`}
              >
                {decision.stakes} STAKES
              </span>
              <span className="font-mono font-bold text-xs px-2.5 py-0.5 uppercase bg-yellow-100 border border-black text-black">
                {decision.reversibility === "one_way_door" ? "1-WAY DOOR (IRREVERSIBLE)" : "2-WAY DOOR (REVERSIBLE)"}
              </span>
              {decision.deadline && (
                <span className="font-mono text-xs text-gray-600 font-bold flex items-center gap-1 ml-2">
                  <Clock className="w-3.5 h-3.5" /> Due {decision.deadline}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight font-display">
              {decision.title}
            </h1>

            {decision.ai_summary && (
              <div className="p-4 bg-gray-50 border-2 border-black text-sm text-gray-800 leading-relaxed font-medium">
                <div className="text-xs font-mono font-bold uppercase text-gray-500 mb-1 flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-black" /> AUDITOR SYNTHESIS (NO RECOMMENDATIONS)
                </div>
                {decision.ai_summary}
              </div>
            )}
          </div>

          {/* Readiness Meter Ring */}
          <div className="flex flex-col items-center justify-center p-6 bg-yellow-50 border-3 border-black shrink-0 shadow-[4px_4px_0_#000]">
            <ProgressRing
              value={decision.readiness_score || 50}
              size={90}
              strokeWidth={10}
            />
            <div className="mt-3 text-center">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-gray-600">
                AUDIT READINESS
              </div>
              <div className="text-xs font-bold text-black uppercase mt-0.5">
                {(decision.readiness_score || 50) >= 75
                  ? "Well-Examined"
                  : (decision.readiness_score || 50) >= 50
                  ? "Assumptions Pending"
                  : "Critical Gaps"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex border-b-3 border-black gap-2 overflow-x-auto pb-0.5">
        {[
          { id: "all", label: "Overview & All Lenses" },
          { id: "options", label: `Options (${decision.options.length})` },
          { id: "blind_spots", label: `Blind Spots (${decision.blind_spots.length})` },
          { id: "premortem", label: `Pre-Mortem (${decision.premortem_items.length})` },
          { id: "actions", label: `Evidence Actions (${decision.actions.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 font-bold uppercase text-xs tracking-wider border-2 border-black transition-all ${
              activeTab === tab.id
                ? "bg-black text-[#FFE600] shadow-[2px_2px_0_#000] -translate-y-0.5"
                : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SECTION: Options Comparison */}
      {(activeTab === "all" || activeTab === "options") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
              <Columns className="w-5 h-5" /> COMPETING OPTIONS
            </h2>
            <span className="text-xs font-mono text-gray-600 font-bold">
              NEUTRAL COMPARISON · NO AUTOMATED SELECTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {decision.options.map((opt, idx) => (
              <Card
                key={opt.id}
                variant="default"
                className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <span className="font-mono text-xs font-black uppercase bg-black text-[#FFE600] px-2 py-0.5">
                      OPTION {idx + 1}
                    </span>
                    {opt.estimated_cost && (
                      <span className="font-mono text-xs font-bold text-gray-700">
                        {opt.estimated_cost}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">
                    {opt.title}
                  </h3>

                  {opt.description && (
                    <p className="text-xs text-gray-700 mb-4">{opt.description}</p>
                  )}

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div className="p-3 bg-green-50 border border-green-800">
                      <div className="font-black uppercase text-green-900 mb-1">Stated Advantages:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-green-950 font-medium">
                        {opt.pros?.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-red-50 border border-red-800">
                      <div className="font-black uppercase text-red-900 mb-1">Trade-offs & Risks:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-red-950 font-medium">
                        {opt.cons?.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Reasons & Stated Logic */}
      {activeTab === "all" && decision.reasons.length > 0 && (
        <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
          <h2 className="text-xl font-black uppercase font-display">
            STATED REASONS & ASSUMPTION INVENTORY
          </h2>
          <div className="divide-y divide-gray-200">
            {decision.reasons.map((r, i) => (
              <div key={r.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-black flex items-center gap-2">
                    <span className="font-mono text-xs bg-gray-200 px-1.5 py-0.5">#{i + 1}</span>
                    {r.statement}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span
                      className={`px-2 py-0.5 font-bold uppercase ${
                        r.is_assumption ? "bg-red-100 text-[#E10600] border border-[#E10600]" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {r.is_assumption ? "Unverified Assumption" : "Stated Fact"}
                    </span>
                    <span className="text-gray-500 uppercase">Evidence: {r.evidence_level}</span>
                  </div>
                </div>

                <div className="w-48 shrink-0">
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>Confidence</span>
                    <span>{r.confidence}%</span>
                  </div>
                  <ConfidenceMeter value={r.confidence} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* SECTION: AI Cognitive Blind Spots */}
      {(activeTab === "all" || activeTab === "blind_spots") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#E10600]" />
              COGNITIVE BLIND SPOTS ({decision.blind_spots.length})
            </h2>
            <span className="text-xs font-mono text-gray-600 font-bold">
              CLICK CARD TO MARK AS ADDRESSED
            </span>
          </div>

          {decision.blind_spots.length === 0 ? (
            <div className="p-8 text-center bg-white border-3 border-black">
              No blind spots detected yet. Click &quot;Re-Test Audit&quot; to run the cognitive audit engine.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {decision.blind_spots.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleToggleBlindSpotStatus(card.id)}
                  className={`p-6 border-4 border-black transition-all cursor-pointer flex flex-col justify-between ${
                    card.status === "addressed"
                      ? "bg-gray-100 opacity-60 shadow-[3px_3px_0_#000]"
                      : "bg-white shadow-[6px_6px_0_#000] hover:-translate-y-1 hover:shadow-[10px_10px_0_#000]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`font-mono text-xs font-black uppercase px-2 py-0.5 border border-black ${
                          card.severity === "critical"
                            ? "bg-[#E10600] text-white"
                            : card.severity === "warning"
                            ? "bg-yellow-300 text-black"
                            : "bg-blue-100 text-black"
                        }`}
                      >
                        {card.severity}
                      </span>

                      <span className="font-mono text-xs font-bold uppercase text-gray-500">
                        {card.bias_type}
                      </span>
                    </div>

                    <h3 className="text-base font-black uppercase tracking-tight mb-2">
                      {card.title}
                    </h3>

                    <p className="text-xs text-gray-700 leading-relaxed mb-4">
                      {card.description}
                    </p>

                    <div className="p-3 bg-yellow-50 border border-black text-xs font-mono font-bold mb-3">
                      <div className="text-[10px] text-gray-500 uppercase">Socratic Question:</div>
                      &ldquo;{card.remedy_question}&rdquo;
                    </div>

                    {card.suggested_action && (
                      <div className="text-xs font-mono text-gray-700">
                        <strong>Action:</strong> {card.suggested_action}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-black flex items-center justify-between text-xs font-bold uppercase">
                    <span>STATUS: {card.status}</span>
                    <span className="text-[#E10600] underline">
                      {card.status === "addressed" ? "Re-open" : "Mark Addressed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION: Pre-Mortem Simulator */}
      {(activeTab === "all" || activeTab === "premortem") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-black" />
              PRE-MORTEM FAILURE SIMULATION ({decision.premortem_items.length})
            </h2>
            <span className="text-xs font-mono text-gray-600 font-bold">
              ASSUMES 1-YEAR FAILURE TO SURFACE PREVENTATIVE MEASURES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {decision.premortem_items.map((item, idx) => (
              <Card
                key={item.id}
                variant="default"
                className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4"
              >
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <span className="font-mono text-xs font-black uppercase bg-[#E10600] text-white px-2 py-0.5">
                    FAILURE SCENARIO #{idx + 1}
                  </span>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="bg-gray-100 border border-black px-1.5 py-0.5">
                      Likelihood: {item.likelihood}
                    </span>
                    <span className="bg-gray-100 border border-black px-1.5 py-0.5">
                      Impact: {item.impact}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-bold text-black leading-snug">
                  &ldquo;{item.scenario}&rdquo;
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 bg-red-50 border border-red-700 text-red-950">
                    <strong className="uppercase block mb-0.5">Early Warning Indicator:</strong>
                    {item.early_indicator}
                  </div>

                  <div className="p-2.5 bg-green-50 border border-green-700 text-green-950">
                    <strong className="uppercase block mb-0.5">Preventative Safeguard:</strong>
                    {item.preventative_measure}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* SECTION: Evidence Actions Kanban */}
      {(activeTab === "all" || activeTab === "actions") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
              <ListTodo className="w-5 h-5" />
              EVIDENCE ACTIONS KANBAN ({decision.actions.length})
            </h2>
            <span className="text-xs font-mono text-gray-600 font-bold">
              VERIFY ASSUMPTIONS BEFORE COMMITTING
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column: To Do */}
            <div className="bg-gray-100 border-3 border-black p-4 space-y-3 shadow-[4px_4px_0_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-mono font-black uppercase text-xs">TO DO</span>
                <span className="font-mono text-xs font-bold bg-white border border-black px-2 py-0.5">
                  {decision.actions.filter((a) => a.status === "todo").length}
                </span>
              </div>

              {decision.actions
                .filter((a) => a.status === "todo")
                .map((act) => (
                  <div
                    key={act.id}
                    className="p-4 bg-white border-2 border-black space-y-2 shadow-[2px_2px_0_#000]"
                  >
                    <div className="text-xs font-black uppercase leading-tight">{act.title}</div>
                    {act.description && <div className="text-[11px] text-gray-600">{act.description}</div>}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase bg-yellow-200 px-1.5 py-0.5">
                        {act.priority} priority
                      </span>
                      <button
                        onClick={() => handleUpdateActionStatus(act.id, "in_progress")}
                        className="text-[11px] font-bold uppercase text-[#E10600] hover:underline"
                      >
                        Start →
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Column: In Progress */}
            <div className="bg-yellow-50 border-3 border-black p-4 space-y-3 shadow-[4px_4px_0_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-mono font-black uppercase text-xs">IN PROGRESS</span>
                <span className="font-mono text-xs font-bold bg-white border border-black px-2 py-0.5">
                  {decision.actions.filter((a) => a.status === "in_progress").length}
                </span>
              </div>

              {decision.actions
                .filter((a) => a.status === "in_progress")
                .map((act) => (
                  <div
                    key={act.id}
                    className="p-4 bg-white border-2 border-black space-y-2 shadow-[2px_2px_0_#000]"
                  >
                    <div className="text-xs font-black uppercase leading-tight">{act.title}</div>
                    {act.description && <div className="text-[11px] text-gray-600">{act.description}</div>}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => handleUpdateActionStatus(act.id, "todo")}
                        className="text-[11px] font-bold uppercase text-gray-500 hover:underline"
                      >
                        ← Back
                      </button>
                      <button
                        onClick={() => handleUpdateActionStatus(act.id, "done")}
                        className="text-[11px] font-bold uppercase text-green-700 hover:underline"
                      >
                        Done ✓
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Column: Done */}
            <div className="bg-green-50 border-3 border-black p-4 space-y-3 shadow-[4px_4px_0_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-2">
                <span className="font-mono font-black uppercase text-xs">VERIFIED & DONE</span>
                <span className="font-mono text-xs font-bold bg-white border border-black px-2 py-0.5">
                  {decision.actions.filter((a) => a.status === "done").length}
                </span>
              </div>

              {decision.actions
                .filter((a) => a.status === "done")
                .map((act) => (
                  <div
                    key={act.id}
                    className="p-4 bg-white border-2 border-black space-y-2 shadow-[2px_2px_0_#000] opacity-80"
                  >
                    <div className="text-xs font-bold uppercase leading-tight line-through text-gray-700">
                      {act.title}
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleUpdateActionStatus(act.id, "in_progress")}
                        className="text-[11px] font-mono uppercase text-gray-400 hover:text-black"
                      >
                        Reopen
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-black p-6 max-w-md w-full shadow-[8px_8px_0_#000] space-y-4">
            <h3 className="text-xl font-black uppercase font-display">
              EMAIL AUDIT REPORT
            </h3>
            <p className="text-xs text-gray-700">
              Dispatches a brutalist formatted decision audit report via configured Gmail SMTP credentials.
            </p>

            <div>
              <label className="block text-xs font-black uppercase mb-1">Recipient Email</label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono text-sm"
              />
            </div>

            {emailStatus && (
              <div className="p-3 bg-yellow-100 border border-black text-xs font-mono font-bold">
                {emailStatus}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setEmailModalOpen(false)}>
                CANCEL
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendEmail}
                disabled={sendingEmail}
              >
                {sendingEmail ? "SENDING..." : "DISPATCH EMAIL"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
