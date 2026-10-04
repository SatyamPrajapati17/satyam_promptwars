"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/brutal/Button";
import { Card } from "@/components/brutal/Card";
import { Chip } from "@/components/brutal/Chip";
import { Input } from "@/components/brutal/Input";
import { ProgressRing } from "@/components/brutal/ProgressRing";
import { Decision } from "@/lib/db/decisions";
import {
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Clock,
  Layers,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  Flame,
  BrainCircuit,
  Filter,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stakesFilter, setStakesFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [creatingSample, setCreatingSample] = useState(false);

  const fetchDecisions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/decisions");
      const json = await res.json();
      if (json.ok && Array.isArray(json.data)) {
        setDecisions(json.data);
      }
    } catch (e) {
      console.error("Failed to load decisions", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
  }, []);

  const handleLoadSample = async () => {
    try {
      setCreatingSample(true);
      const res = await fetch("/api/decisions/sample", { method: "POST" });
      const json = await res.json();
      if (json.ok && json.data) {
        setDecisions((prev) => [json.data, ...prev]);
        router.push(`/decisions/${json.data.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingSample(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this decision audit?")) return;
    try {
      const res = await fetch(`/api/decisions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDecisions((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = decisions.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || d.category === categoryFilter;
    const matchesStakes = stakesFilter === "all" || d.stakes === stakesFilter;
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStakes && matchesStatus;
  });

  const totalDecisions = decisions.length;
  const highStakesCount = decisions.filter((d) => d.stakes === "high" || d.stakes === "critical").length;
  const avgReadiness =
    totalDecisions > 0
      ? Math.round(decisions.reduce((acc, d) => acc + (d.readiness_score || 50), 0) / totalDecisions)
      : 0;
  const totalBiasesCaught = decisions.reduce((acc, d) => acc + (d.blind_spots?.length || 0), 0);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black uppercase tracking-tight font-display">
              DECISION HUB
            </h1>
            <span className="bg-[#FFE600] border-2 border-black px-2 py-0.5 text-xs font-mono font-bold">
              {totalDecisions} AUDITED
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-gray-700">
            Never decide blindly. Audit assumptions, uncover blind spots, and run pre-mortems.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={handleLoadSample}
            disabled={creatingSample}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#E10600]" />
            {creatingSample ? "LOADING..." : "SAMPLE DECISION"}
          </Button>

          <Button href="/decisions/new" variant="primary" size="md" className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            NEW DECISION
          </Button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Total Decisions</div>
          <div className="mt-2 text-3xl font-black font-display">{totalDecisions}</div>
          <div className="mt-1 text-xs text-gray-600 font-medium">In your audit workspace</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">High / Critical Stakes</div>
          <div className="mt-2 text-3xl font-black font-display text-[#E10600] flex items-center gap-1.5">
            <Flame className="w-6 h-6 shrink-0 fill-current" />
            {highStakesCount}
          </div>
          <div className="mt-1 text-xs text-gray-600 font-medium">Irreversible or strategic</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Avg Audit Readiness</div>
          <div className="mt-2 text-3xl font-black font-display text-black">
            {avgReadiness}%
          </div>
          <div className="mt-1 text-xs text-gray-600 font-medium">Across active options</div>
        </Card>

        <Card variant="default" className="p-5 bg-white border-3 border-black shadow-[4px_4px_0_#000]">
          <div className="text-xs font-mono font-bold uppercase text-gray-500">Biases Surfaced</div>
          <div className="mt-2 text-3xl font-black font-display text-black flex items-center gap-1.5">
            <BrainCircuit className="w-6 h-6 shrink-0" />
            {totalBiasesCaught}
          </div>
          <div className="mt-1 text-xs text-gray-600 font-medium">Neutralized by auditor</div>
        </Card>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0_#000] flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search decisions by title, keyword, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-2 border-black font-mono text-sm focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
          >
            <option value="all">Status: All</option>
            <option value="draft">Status: Draft</option>
            <option value="audited">Status: Audited</option>
            <option value="decided">Status: Decided</option>
          </select>

          <select
            value={stakesFilter}
            onChange={(e) => setStakesFilter(e.target.value)}
            className="px-3 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
          >
            <option value="all">Stakes: All</option>
            <option value="critical">Stakes: Critical</option>
            <option value="high">Stakes: High</option>
            <option value="medium">Stakes: Medium</option>
            <option value="low">Stakes: Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white border-2 border-black font-bold text-xs uppercase"
          >
            <option value="all">Category: All</option>
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="career">Career</option>
            <option value="financial">Financial</option>
            <option value="product">Product</option>
            <option value="personal">Personal</option>
          </select>
        </div>
      </div>

      {/* Decisions Grid */}
      {loading ? (
        <div className="p-12 text-center bg-white border-4 border-black font-mono font-bold">
          LOADING AUDIT WORKSPACE...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-4">
          <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0_#000]">
            <Layers className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-black uppercase font-display">NO DECISIONS FOUND</h2>
          <p className="text-sm text-gray-700 max-w-md mx-auto">
            {search || categoryFilter !== "all" || stakesFilter !== "all"
              ? "No decisions match your current filters. Clear filters or create a new one."
              : "You have not created any decisions yet. Start a new decision or load the sample engineering decision to explore."}
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Button variant="secondary" size="md" onClick={handleLoadSample} disabled={creatingSample}>
              <Sparkles className="w-4 h-4 mr-2 text-[#E10600]" />
              LOAD SAMPLE DECISION
            </Button>
            <Button href="/decisions/new" variant="primary" size="md">
              <Plus className="w-4 h-4 mr-2" />
              CREATE NEW DECISION
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((decision) => (
            <Card
              key={decision.id}
              variant="default"
              className="p-6 bg-white border-4 border-black shadow-[6px_6px_0_#000] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] transition-all cursor-pointer group"
              onClick={() => router.push(`/decisions/${decision.id}`)}
            >
              <div>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-black text-[#FFE600] font-mono font-bold text-xs px-2 py-0.5 uppercase">
                    {decision.category}
                  </span>

                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 uppercase border border-black ${
                      decision.stakes === "critical"
                        ? "bg-[#E10600] text-white"
                        : decision.stakes === "high"
                        ? "bg-red-100 text-[#E10600]"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {decision.stakes} STAKES
                  </span>

                  <span className="text-xs font-mono text-gray-500 font-bold uppercase ml-auto">
                    {decision.reversibility === "one_way_door" ? "1-WAY DOOR" : "2-WAY DOOR"}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-[#E10600] transition-colors line-clamp-2">
                  {decision.title}
                </h3>

                {/* Options count & status */}
                <div className="mt-4 flex items-center justify-between text-xs font-mono border-t border-b border-gray-200 py-2 text-gray-700">
                  <span>{decision.options.length} OPTIONS</span>
                  <span>{decision.blind_spots.length} BLIND SPOTS</span>
                  <span className="font-bold uppercase text-black">{decision.status}</span>
                </div>

                {/* Readiness summary */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase text-gray-500">Readiness Score</div>
                    <div className="text-2xl font-black font-display">
                      {decision.readiness_score || 50}%
                    </div>
                  </div>
                  <ProgressRing
                    value={decision.readiness_score || 50}
                    size={48}
                    strokeWidth={6}
                  />
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">
                  {new Date(decision.updated_at).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/decisions/${decision.id}/edit`);
                    }}
                    className="p-1.5 border border-black hover:bg-yellow-200 transition-colors"
                    title="Edit Inputs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => handleDelete(decision.id, e)}
                    className="p-1.5 border border-black text-[#E10600] hover:bg-red-50 transition-colors"
                    title="Delete Decision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="font-bold text-xs uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform text-[#E10600]">
                    AUDIT <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
