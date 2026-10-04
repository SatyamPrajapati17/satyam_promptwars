"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Textarea } from "@/components/brutal/Textarea";
import { Stepper } from "@/components/brutal/Stepper";
import { Slider } from "@/components/brutal/Slider";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Brain,
  HelpCircle,
} from "lucide-react";

export default function NewDecisionWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<
    "business" | "technical" | "career" | "financial" | "product" | "personal"
  >("business");
  const [stakes, setStakes] = useState<"low" | "medium" | "high" | "critical">("high");
  const [reversibility, setReversibility] = useState<"two_way_door" | "one_way_door">(
    "two_way_door"
  );
  const [deadline, setDeadline] = useState("");

  // Options State (At least 2)
  const [options, setOptions] = useState([
    {
      id: "opt-1",
      title: "",
      description: "",
      pros: [""],
      cons: [""],
      estimated_cost: "",
    },
    {
      id: "opt-2",
      title: "",
      description: "",
      pros: [""],
      cons: [""],
      estimated_cost: "",
    },
  ]);

  // Reasons & Assumptions
  const [reasons, setReasons] = useState([
    {
      id: "rs-1",
      statement: "",
      confidence: 70,
      evidence_level: "moderate" as const,
      is_assumption: false,
    },
  ]);

  // Emotional context
  const [gutFeeling, setGutFeeling] = useState("");
  const [stressLevel, setStressLevel] = useState(5);
  const [timePressure, setTimePressure] = useState(false);

  // Steps configuration
  const steps = ["Scope", "Options", "Reasons", "Context", "Review"];

  const handleAddOption = () => {
    setOptions((prev) => [
      ...prev,
      {
        id: `opt-${Date.now()}`,
        title: "",
        description: "",
        pros: [""],
        cons: [""],
        estimated_cost: "",
      },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddReason = () => {
    setReasons((prev) => [
      ...prev,
      {
        id: `rs-${Date.now()}`,
        statement: "",
        confidence: 60,
        evidence_level: "moderate",
        is_assumption: true,
      },
    ]);
  };

  const handleRemoveReason = (index: number) => {
    if (reasons.length <= 1) return;
    setReasons((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        title: title || "Strategic Initiative",
        category,
        stakes,
        reversibility,
        deadline: deadline || null,
        emotional_state: {
          gut_feeling: gutFeeling,
          stress_level: stressLevel,
          time_pressure: timePressure,
        },
        options: options.map((opt) => ({
          ...opt,
          pros: opt.pros.filter((p) => p.trim().length > 0),
          cons: opt.cons.filter((c) => c.trim().length > 0),
        })),
        reasons: reasons.filter((r) => r.statement.trim().length > 0),
      };

      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.ok && json.data) {
        // Trigger immediate AI audit
        fetch(`/api/decisions/${json.data.id}/analyze`, { method: "POST" });
        router.push(`/decisions/${json.data.id}`);
      } else {
        alert("Failed to save decision. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving decision.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black hover:text-[#E10600] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2 py-1">
          STEP {currentStep} OF 5
        </span>
      </div>

      <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_#000]">
        <h1 className="text-3xl font-black uppercase tracking-tight font-display">
          STRUCTURE YOUR DECISION
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-700">
          State your options, evidence, and assumptions. The AI will audit your logic and test blind spots.
        </p>
        <div className="mt-6">
          <Stepper steps={steps} currentStep={currentStep} onStepClick={(step) => setCurrentStep(step)} />
        </div>
      </div>

      {/* Step 1: Decision Scope */}
      {currentStep === 1 && (
        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <div>
            <label className="block text-sm font-black uppercase tracking-wider mb-2">
              Decision Question / Statement *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Should we migrate our primary database to a distributed cluster?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base"
            />
            <p className="mt-1 text-xs text-gray-500 font-mono">
              Phrase it as a concrete choice rather than an open question.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-3 bg-white border-2 border-black font-bold text-sm uppercase shadow-[2px_2px_0_#000]"
              >
                <option value="business">Business / Strategic</option>
                <option value="technical">Technical / Architecture</option>
                <option value="career">Career / Hiring</option>
                <option value="product">Product / Features</option>
                <option value="financial">Financial / Budget</option>
                <option value="personal">Personal / Life</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Stakes Level
              </label>
              <select
                value={stakes}
                onChange={(e: any) => setStakes(e.target.value)}
                className="w-full p-3 bg-white border-2 border-black font-bold text-sm uppercase shadow-[2px_2px_0_#000]"
              >
                <option value="critical">Critical (Company-level impact)</option>
                <option value="high">High (Department / Major resources)</option>
                <option value="medium">Medium (Team / Moderate cost)</option>
                <option value="low">Low (Minor reversible test)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Reversibility (Door Type)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReversibility("two_way_door")}
                  className={`p-3 border-2 border-black font-bold text-xs uppercase text-left transition-all ${
                    reversibility === "two_way_door"
                      ? "bg-[#FFE600] shadow-[3px_3px_0_#000]"
                      : "bg-gray-50 hover:bg-white"
                  }`}
                >
                  <div className="font-black text-sm">2-WAY DOOR</div>
                  <div className="text-[11px] text-gray-600 mt-1">Easily reversible if results fail</div>
                </button>

                <button
                  type="button"
                  onClick={() => setReversibility("one_way_door")}
                  className={`p-3 border-2 border-black font-bold text-xs uppercase text-left transition-all ${
                    reversibility === "one_way_door"
                      ? "bg-[#E10600] text-white shadow-[3px_3px_0_#000]"
                      : "bg-gray-50 hover:bg-white"
                  }`}
                >
                  <div className="font-black text-sm">1-WAY DOOR</div>
                  <div className="text-[11px] mt-1 opacity-90">Virtually irreversible once committed</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black uppercase tracking-wider mb-2">
                Decision Deadline (Optional)
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              disabled={!title.trim()}
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2"
            >
              NEXT: OPTIONS <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 2: Options */}
      {currentStep === 2 && (
        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase font-display">COMPETING OPTIONS</h2>
              <p className="text-xs text-gray-600 font-mono">
                Compare at least 2 distinct paths. Do not create false binaries.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleAddOption} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> ADD OPTION
            </Button>
          </div>

          <div className="space-y-6">
            {options.map((opt, idx) => (
              <div key={opt.id} className="border-3 border-black p-5 bg-gray-50 relative shadow-[4px_4px_0_#000]">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs font-black uppercase bg-black text-white px-2 py-0.5">
                    OPTION {idx + 1}
                  </span>
                  {options.length > 2 && (
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      className="text-[#E10600] hover:text-black font-bold text-xs uppercase flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Option Title *</label>
                    <Input
                      type="text"
                      placeholder={`e.g. ${idx === 0 ? "Option A: Dedicated Cloud Migration" : "Option B: Optimize In-House Infrastructure"}`}
                      value={opt.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((o, i) => (i === idx ? { ...o, title: val } : o))
                        );
                      }}
                      className="w-full bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Description & Scope</label>
                    <Textarea
                      rows={2}
                      placeholder="Briefly describe what committing to this option entails..."
                      value={opt.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((o, i) => (i === idx ? { ...o, description: val } : o))
                        );
                      }}
                      className="w-full bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase mb-1">Estimated Cost / Investment</label>
                    <Input
                      type="text"
                      placeholder="e.g. $45,000 / 3 engineering weeks"
                      value={opt.estimated_cost}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptions((prev) =>
                          prev.map((o, i) => (i === idx ? { ...o, estimated_cost: val } : o))
                        );
                      }}
                      className="w-full bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="secondary" size="md" onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={options.some((o) => !o.title.trim())}
              onClick={() => setCurrentStep(3)}
              className="flex items-center gap-2"
            >
              NEXT: REASONS & ASSUMPTIONS <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Reasons & Assumptions */}
      {currentStep === 3 && (
        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black uppercase font-display">REASONS & ASSUMPTIONS</h2>
              <p className="text-xs text-gray-600 font-mono">
                What beliefs support this decision? Declare assumptions honestly.
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleAddReason} className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> ADD REASON
            </Button>
          </div>

          <div className="space-y-4">
            {reasons.map((r, idx) => (
              <div key={r.id} className="border-3 border-black p-4 bg-gray-50 space-y-3 shadow-[3px_3px_0_#000]">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-black uppercase">REASON #{idx + 1}</span>
                  {reasons.length > 1 && (
                    <button
                      onClick={() => handleRemoveReason(idx)}
                      className="text-[#E10600] font-bold text-xs uppercase flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <Input
                  type="text"
                  placeholder="e.g. Customers will pay 20% premium for this feature within 60 days."
                  value={r.statement}
                  onChange={(e) => {
                    const val = e.target.value;
                    setReasons((prev) =>
                      prev.map((item, i) => (i === idx ? { ...item, statement: val } : item))
                    );
                  }}
                  className="w-full bg-white"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">
                      Confidence Level: {r.confidence}%
                    </label>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={r.confidence}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setReasons((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, confidence: val } : item))
                        );
                      }}
                      className="w-full accent-black cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase mb-1">Evidence Level</label>
                    <select
                      value={r.evidence_level}
                      onChange={(e: any) => {
                        const val = e.target.value;
                        setReasons((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, evidence_level: val } : item))
                        );
                      }}
                      className="w-full p-1.5 bg-white border-2 border-black font-bold text-xs uppercase"
                    >
                      <option value="rigorous">Rigorous (Hard Data / Trial)</option>
                      <option value="moderate">Moderate (Survey / Historical)</option>
                      <option value="anecdotal">Anecdotal (Conversations)</option>
                      <option value="unverified">Unverified (Gut Guess)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-4 md:pt-0">
                    <input
                      type="checkbox"
                      id={`chk-${r.id}`}
                      checked={r.is_assumption}
                      onChange={(e) => {
                        const val = e.target.checked;
                        setReasons((prev) =>
                          prev.map((item, i) => (i === idx ? { ...item, is_assumption: val } : item))
                        );
                      }}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                    <label htmlFor={`chk-${r.id}`} className="text-xs font-bold uppercase cursor-pointer">
                      Flag as Unverified Assumption
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="secondary" size="md" onClick={() => setCurrentStep(2)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={reasons.some((r) => !r.statement.trim())}
              onClick={() => setCurrentStep(4)}
              className="flex items-center gap-2"
            >
              NEXT: EMOTIONAL CONTEXT <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 4: Emotional Context */}
      {currentStep === 4 && (
        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <div>
            <h2 className="text-xl font-black uppercase font-display">DECISION STATE & EMOTIONAL AUDIT</h2>
            <p className="text-xs text-gray-600 font-mono mt-1">
              Decisions made under stress or rush contain predictable cognitive distortions.
            </p>
          </div>

          <div>
            <label className="block text-sm font-black uppercase tracking-wider mb-2">
              What is your current intuition / gut feeling?
            </label>
            <Textarea
              rows={3}
              placeholder="e.g. I instinctively prefer Option A because of team excitement, but I dread the potential maintenance overhead..."
              value={gutFeeling}
              onChange={(e) => setGutFeeling(e.target.value)}
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-black uppercase tracking-wider">
                Current Stress / Pressure Level: {stressLevel} / 10
              </label>
              <span className="text-xs font-mono font-bold uppercase">
                {stressLevel >= 8 ? "🔥 HIGH STRESS" : stressLevel >= 5 ? "⚡ MODERATE" : "🟢 CALM"}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="p-4 border-2 border-black bg-yellow-50 flex items-center justify-between">
            <div>
              <div className="text-sm font-black uppercase">Are you facing severe time pressure?</div>
              <div className="text-xs text-gray-700">Does a ticking clock prevent collecting better data?</div>
            </div>
            <button
              type="button"
              onClick={() => setTimePressure(!timePressure)}
              className={`px-4 py-2 border-2 border-black font-black uppercase text-xs transition-all ${
                timePressure ? "bg-[#E10600] text-white shadow-[2px_2px_0_#000]" : "bg-white"
              }`}
            >
              {timePressure ? "YES, RUSHED" : "NO, ADEQUATE TIME"}
            </button>
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="secondary" size="md" onClick={() => setCurrentStep(3)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button variant="primary" size="lg" onClick={() => setCurrentStep(5)} className="flex items-center gap-2">
              NEXT: REVIEW AUDIT <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Step 5: Review & Submit */}
      {currentStep === 5 && (
        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[6px_6px_0_#000] space-y-6">
          <div className="border-b-2 border-black pb-4">
            <h2 className="text-2xl font-black uppercase font-display">CONFIRM & RUN AI AUDIT</h2>
            <p className="text-xs text-gray-600 font-mono mt-1">
              Review your decision parameters before triggering the cognitive audit.
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="font-mono text-xs font-bold uppercase text-gray-500">Statement:</span>
              <div className="text-lg font-black uppercase">{title}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs border-t border-b border-gray-200 py-3">
              <div>
                <span className="text-gray-500 block uppercase">Category</span>
                <span className="font-bold uppercase text-black">{category}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Stakes</span>
                <span className="font-bold uppercase text-black">{stakes}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Reversibility</span>
                <span className="font-bold uppercase text-black">{reversibility}</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase">Deadline</span>
                <span className="font-bold uppercase text-black">{deadline || "None"}</span>
              </div>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase text-gray-500">Options ({options.length}):</span>
              <ul className="mt-1 space-y-1 font-bold">
                {options.map((o, idx) => (
                  <li key={o.id} className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-black text-white px-1.5 py-0.5">#{idx + 1}</span>
                    {o.title}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase text-gray-500">Reasons Declared ({reasons.length}):</span>
              <ul className="mt-1 space-y-1 text-xs font-mono">
                {reasons.map((r) => (
                  <li key={r.id} className="text-gray-800">
                    &bull; {r.statement} ({r.confidence}% confidence, {r.is_assumption ? "Assumption" : "Fact"})
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-[#FFE600] border-3 border-black text-xs font-bold uppercase flex items-start gap-2 shadow-[3px_3px_0_#000]">
            <Brain className="w-5 h-5 shrink-0" />
            <span>
              The AI auditor will challenge your logic, generate blind spots, simulate a pre-mortem, and provide an action checklist. It will never tell you what to choose.
            </span>
          </div>

          <div className="pt-4 flex justify-between">
            <Button variant="secondary" size="md" onClick={() => setCurrentStep(4)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> BACK
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2"
            >
              {submitting ? "RUNNING AUDIT..." : "TRIGGER AI AUDIT →"}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
