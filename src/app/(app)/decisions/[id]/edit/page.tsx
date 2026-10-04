"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Textarea } from "@/components/brutal/Textarea";
import { Decision } from "@/lib/db/decisions";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";

export default function EditDecisionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchDecision() {
      try {
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
    }
    if (id) fetchDecision();
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/decisions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(decision),
      });
      const json = await res.json();
      if (json.ok) {
        router.push(`/decisions/${id}`);
      } else {
        alert("Failed to save changes.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center font-mono font-bold bg-white border-4 border-black">LOADING DECISION...</div>;
  }

  if (!decision) {
    return (
      <div className="p-12 text-center bg-white border-4 border-black">
        <h2 className="text-xl font-black uppercase">Decision Not Found</h2>
        <Button href="/dashboard" variant="primary" size="sm" className="mt-4">Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/decisions/${id}`}
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#E10600]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Decision
        </Link>
        <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2 py-1">
          EDIT MODE
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card variant="default" className="p-6 md:p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <h1 className="text-2xl font-black uppercase tracking-tight font-display">
            EDIT DECISION PARAMETERS
          </h1>

          <div>
            <label className="block text-xs font-black uppercase mb-1.5">Decision Title / Statement</label>
            <Input
              type="text"
              required
              value={decision.title}
              onChange={(e) => setDecision({ ...decision, title: e.target.value })}
              className="w-full text-base"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black uppercase mb-1.5">Category</label>
              <select
                value={decision.category}
                onChange={(e: any) => setDecision({ ...decision, category: e.target.value })}
                className="w-full p-2.5 bg-white border-2 border-black font-bold text-xs uppercase"
              >
                <option value="business">Business</option>
                <option value="technical">Technical</option>
                <option value="career">Career</option>
                <option value="product">Product</option>
                <option value="financial">Financial</option>
                <option value="personal">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1.5">Stakes</label>
              <select
                value={decision.stakes}
                onChange={(e: any) => setDecision({ ...decision, stakes: e.target.value })}
                className="w-full p-2.5 bg-white border-2 border-black font-bold text-xs uppercase"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase mb-1.5">Reversibility</label>
              <select
                value={decision.reversibility}
                onChange={(e: any) => setDecision({ ...decision, reversibility: e.target.value })}
                className="w-full p-2.5 bg-white border-2 border-black font-bold text-xs uppercase"
              >
                <option value="two_way_door">2-Way Door (Reversible)</option>
                <option value="one_way_door">1-Way Door (Irreversible)</option>
              </select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4 pt-4 border-t-2 border-black">
            <h2 className="text-lg font-black uppercase font-display">OPTIONS</h2>
            {decision.options.map((opt, i) => (
              <div key={opt.id} className="p-4 border-2 border-black bg-gray-50 space-y-2">
                <span className="font-mono text-xs font-bold uppercase bg-black text-white px-2 py-0.5">
                  OPTION {i + 1}
                </span>
                <Input
                  type="text"
                  value={opt.title}
                  onChange={(e) => {
                    const titleVal = e.target.value;
                    const opts = decision.options.map((o, idx) =>
                      idx === i ? { ...o, title: titleVal } : o
                    );
                    setDecision({ ...decision, options: opts });
                  }}
                  className="w-full bg-white mt-1"
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button href={`/decisions/${id}`} variant="secondary" size="md">
              CANCEL
            </Button>
            <Button type="submit" variant="primary" size="md" disabled={saving}>
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
