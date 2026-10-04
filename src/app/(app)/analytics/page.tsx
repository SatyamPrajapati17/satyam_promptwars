"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Decision } from "@/lib/db/decisions";
import {
  BarChart2,
  Brain,
  ShieldAlert,
  TrendingUp,
  ArrowLeft,
  CheckCircle2,
  Flame,
  Award,
} from "lucide-react";

export default function AnalyticsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/decisions");
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          setDecisions(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalDecisions = decisions.length;
  const criticalCount = decisions.filter((d) => d.stakes === "critical" || d.stakes === "high").length;
  const totalBlindSpots = decisions.reduce((acc, d) => acc + (d.blind_spots?.length || 0), 0);
  const totalActions = decisions.reduce((acc, d) => acc + (d.actions?.length || 0), 0);
  const completedActions = decisions.reduce(
    (acc, d) => acc + (d.actions?.filter((a) => a.status === "done").length || 0),
    0
  );

  const biasCounts: Record<string, number> = {};
  decisions.forEach((d) => {
    d.blind_spots?.forEach((bs) => {
      biasCounts[bs.bias_type] = (biasCounts[bs.bias_type] || 0) + 1;
    });
  });

  const biasList = Object.entries(biasCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#E10600]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2 py-1">
          ANALYTICS & BIAS TELEMETRY
        </span>
      </div>

      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
        <h1 className="text-3xl font-black uppercase tracking-tight font-display">
          COGNITIVE AUDIT ANALYTICS
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          Track recurring cognitive distortions and verification completion across your decisions.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Decisions Audited</div>
          <div className="mt-2 text-3xl font-black font-display">{totalDecisions}</div>
          <div className="mt-1 text-xs text-gray-600">Total historical decisions</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Biases Surfaced</div>
          <div className="mt-2 text-3xl font-black font-display text-[#E10600] flex items-center gap-1.5">
            <Brain className="w-6 h-6 shrink-0" />
            {totalBlindSpots}
          </div>
          <div className="mt-1 text-xs text-gray-600">Cognitive traps neutralized</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">High / Critical Stakes</div>
          <div className="mt-2 text-3xl font-black font-display">{criticalCount}</div>
          <div className="mt-1 text-xs text-gray-600">Irreversible commitments</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Verification Actions</div>
          <div className="mt-2 text-3xl font-black font-display text-green-700">
            {completedActions} / {totalActions}
          </div>
          <div className="mt-1 text-xs text-gray-600">Evidence verified before choice</div>
        </Card>
      </div>

      {/* Bias Breakdown Table */}
      <Card variant="default" className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
        <h2 className="text-xl font-black uppercase font-display flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#E10600]" /> FREQUENCY OF COGNITIVE BIASES DETECTED
        </h2>

        {biasList.length === 0 ? (
          <div className="p-6 text-center font-mono text-xs text-gray-500">
            No cognitive biases logged yet. Run an audit on a decision to populate telemetry.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {biasList.map(([bias, count]) => {
              const pct = totalBlindSpots > 0 ? Math.round((count / totalBlindSpots) * 100) : 0;
              return (
                <div key={bias} className="py-3 flex items-center justify-between gap-4">
                  <div className="font-bold text-sm uppercase flex-1">{bias}</div>
                  <div className="w-48 bg-gray-100 border border-black h-4 overflow-hidden">
                    <div className="bg-[#E10600] h-full" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="font-mono text-xs font-bold text-black w-20 text-right">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
