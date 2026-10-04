"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Home, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Database, Eye } from "lucide-react";
import { Button } from "@/components/brutal/Button";
import { Card } from "@/components/brutal/Card";
import { Chip } from "@/components/brutal/Chip";

interface Slide {
  id: number;
  badge: string;
  title: string;
  subtitle?: string;
  render: () => React.ReactNode;
}

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const slides: Slide[] = [
    {
      id: 1,
      badge: "HACKATHON PITCH · THE UNBIAS",
      title: "THE UNBIAS",
      subtitle: "See the decision you are actually making.",
      render: () => (
        <div className="space-y-6 text-center max-w-3xl mx-auto py-8">
          <div className="inline-block bg-black text-[#FFE600] font-mono font-bold text-xs px-3 py-1 border-2 border-black uppercase shadow-[3px_3px_0_#000]">
            An AI Decision-Audit Workspace · Never Decides For You
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase text-black leading-tight"
            style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
          >
            MAKE BIG DECISIONS HARDER TO FOOL YOURSELF ABOUT.
          </h2>
          <p className="text-xl font-medium text-gray-800 leading-relaxed">
            &ldquo;The AI does not give you a better answer. It helps you notice the answer you were already smuggling in.&rdquo;
          </p>
          <div className="grid grid-cols-3 gap-4 pt-6 text-left">
            <div className="bg-white border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <div className="font-mono text-xs font-bold text-black uppercase">01. Canvas</div>
              <div className="text-sm font-bold mt-1">Structured Framing</div>
            </div>
            <div className="bg-[#FFE600] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <div className="font-mono text-xs font-bold text-black uppercase">02. Audit</div>
              <div className="text-sm font-bold mt-1">Blind Spots &amp; Map</div>
            </div>
            <div className="bg-[#7DD3FC] border-2 border-black p-4 shadow-[3px_3px_0_#000]">
              <div className="font-mono text-xs font-bold text-black uppercase">03. Action</div>
              <div className="text-sm font-bold mt-1">Kanban &amp; Pre-Mortem</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: "THE PROBLEM",
      title: "THE CRITICAL THINKING PARADOX",
      subtitle: "Why generic AI makes bad decisions worse.",
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          <Card className="bg-red-50 border-[3px] border-black space-y-4">
            <Chip variant="red">CONVENTIONAL CHATBOTS</Chip>
            <h3 className="text-2xl font-black uppercase">The Illusion of Counsel</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-800">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E10600] shrink-0" />
                <span><strong>Hands over a verdict:</strong> AI ranks options or gives superficial pros/cons.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E10600] shrink-0" />
                <span><strong>Strips user agency:</strong> Users outsource thinking rather than examining their own logic.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-[#E10600] shrink-0" />
                <span><strong>Unchecked bias:</strong> Confirms whatever confirmation bias the prompt implied.</span>
              </li>
            </ul>
          </Card>
          <Card className="bg-yellow-50 border-[3px] border-black space-y-4">
            <Chip variant="yellow">THE UNBIAS APPROACH</Chip>
            <h3 className="text-2xl font-black uppercase">Inspect Your Own Reasoning</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-800">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span><strong>Zero recommendations:</strong> Never picks a winner or calculates an option score.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span><strong>Quotes your words:</strong> Surfaced assumptions cite verbatim quotes from your input.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span><strong>Empirical Action:</strong> Converts uncertainties into real-world verification steps.</span>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: 3,
      badge: "SYSTEM ARCHITECTURE",
      title: "PRODUCTION TECH STACK",
      subtitle: "Fast, resilient, and private by design.",
      render: () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6">
          <Card className="space-y-2">
            <div className="w-10 h-10 bg-[#FFE600] border-2 border-black flex items-center justify-center font-black">
              01
            </div>
            <h4 className="font-black text-lg uppercase">Next.js 16</h4>
            <p className="text-xs text-gray-700">
              Turbopack engine, App Router, React 19, strict TypeScript, proxy.ts route protection.
            </p>
          </Card>
          <Card className="space-y-2">
            <div className="w-10 h-10 bg-[#6EE7A8] border-2 border-black flex items-center justify-center font-black">
              02
            </div>
            <h4 className="font-black text-lg uppercase">Supabase RLS</h4>
            <p className="text-xs text-gray-700">
              PostgreSQL schema with 100% Row Level Security, composite keys, and versioned runs.
            </p>
          </Card>
          <Card className="space-y-2">
            <div className="w-10 h-10 bg-[#7DD3FC] border-2 border-black flex items-center justify-center font-black">
              03
            </div>
            <h4 className="font-black text-lg uppercase">NVIDIA NIM</h4>
            <p className="text-xs text-gray-700">
              Server-side only inference. Hidden from the UI. Structured JSON schemas with fallback repairs.
            </p>
          </Card>
          <Card className="space-y-2">
            <div className="w-10 h-10 bg-[#FF6B6B] border-2 border-black flex items-center justify-center font-black">
              04
            </div>
            <h4 className="font-black text-lg uppercase">Sheets &amp; Mail</h4>
            <p className="text-xs text-gray-700">
              Google Sheets outbox with HMAC SHA-256 telemetry. Gmail SMTP reminders worker.
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: 4,
      badge: "CORE WORKFLOW",
      title: "THE 6-STEP AUDIT PIPELINE",
      subtitle: "From messy dilemma to empirical action plan.",
      render: () => (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-black text-white px-1.5 py-0.5">1. CANVAS</span>
              <h5 className="font-bold text-sm uppercase mt-1">Decision Wizard</h5>
              <p className="text-xs text-gray-600">5 steps: frame, options, reasons, impact, timeline.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-[#FFE600] text-black px-1.5 py-0.5 border border-black">2. MAP</span>
              <h5 className="font-bold text-sm uppercase mt-1">Reasoning Graph</h5>
              <p className="text-xs text-gray-600">React Flow DAG: reasons, claims, assumptions, risks.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-[#FF6B6B] text-black px-1.5 py-0.5 border border-black">3. CARDS</span>
              <h5 className="font-bold text-sm uppercase mt-1">Blind-Spot Triage</h5>
              <p className="text-xs text-gray-600">4-7 cards categorized with user quote verification.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-amber-200 text-black px-1.5 py-0.5 border border-black">4. RED-TEAM</span>
              <h5 className="font-bold text-sm uppercase mt-1">Challenge Thinking</h5>
              <p className="text-xs text-gray-600">5 personalized questions targeting load-bearing reasons.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-zinc-800 text-[#FFE600] px-1.5 py-0.5 border border-black">5. PRE-MORTEM</span>
              <h5 className="font-bold text-sm uppercase mt-1">Failure Simulation</h5>
              <p className="text-xs text-gray-600">Inverted screen, 6-month future timeline, risk clustering.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <span className="font-mono text-xs font-bold bg-[#6EE7A8] text-black px-1.5 py-0.5 border border-black">6. KANBAN</span>
              <h5 className="font-bold text-sm uppercase mt-1">Evidence Actions</h5>
              <p className="text-xs text-gray-600">Drag-and-drop actions board with reminders and PDF report.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      badge: "SCIENTIFIC RIGOR",
      title: "REASONING READINESS SCORE",
      subtitle: "Deterministic, explainable, transparent metric (0–100).",
      render: () => (
        <div className="space-y-6 py-4">
          <div className="bg-black text-[#FFE600] p-4 border-[3px] border-black font-mono text-sm shadow-[4px_4px_0_#000]">
            RRS = 0.30·EC + 0.20·AE + 0.20·RR + 0.15·CD + 0.15·AM
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-medium">
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <div className="font-mono font-bold text-red-600">30% EC</div>
              <div className="font-bold mt-1">Evidence Coverage</div>
              <p className="text-gray-600 mt-0.5 text-[11px]">Claims verified vs assumed.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <div className="font-mono font-bold text-amber-600">20% AE</div>
              <div className="font-bold mt-1">Assumption Exposure</div>
              <p className="text-gray-600 mt-0.5 text-[11px]">Blind-spots audited on board.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <div className="font-mono font-bold text-purple-600">20% RR</div>
              <div className="font-bold mt-1">Risk Readiness</div>
              <p className="text-gray-600 mt-0.5 text-[11px]">Mitigation of pre-mortem failures.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <div className="font-mono font-bold text-blue-600">15% CD</div>
              <div className="font-bold mt-1">Challenge Depth</div>
              <p className="text-gray-600 mt-0.5 text-[11px]">Red-team answers provided.</p>
            </div>
            <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0_#000]">
              <div className="font-mono font-bold text-emerald-600">15% AM</div>
              <div className="font-bold mt-1">Action Momentum</div>
              <p className="text-gray-600 mt-0.5 text-[11px]">Completed tasks on Kanban.</p>
            </div>
          </div>
          <div className="p-3 bg-yellow-100 border-2 border-black font-mono text-xs font-bold text-black text-center">
            ★ Measures how thoroughly you examined the decision — NEVER which option is right.
          </div>
        </div>
      ),
    },
    {
      id: 6,
      badge: "LIVE DEMO HIGHLIGHTS",
      title: "KEY PRODUCT CAPABILITIES",
      subtitle: "Tested end-to-end with zero mock code.",
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 text-sm font-medium">
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-red-600 uppercase">Interactive Map</div>
            <div className="font-bold text-sm">DAG Node Graph</div>
            <p className="text-xs text-gray-700">Zoom, pan, node drawer, and convert-to-action.</p>
          </Card>
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-blue-600 uppercase">dnd-kit Kanban</div>
            <div className="font-bold text-sm">Actions Board</div>
            <p className="text-xs text-gray-700">Drag &amp; drop, priority tags, stamp-check animation.</p>
          </Card>
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-emerald-600 uppercase">Export Suite</div>
            <div className="font-bold text-sm">PDF &amp; Markdown</div>
            <p className="text-xs text-gray-700">Server PDFKit rendering, print stylesheet, email delivery.</p>
          </Card>
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-amber-600 uppercase">Versioned Re-Test</div>
            <div className="font-bold text-sm">Run Comparison</div>
            <p className="text-xs text-gray-700">Jaccard diffing carries over user triage states.</p>
          </Card>
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-purple-600 uppercase">Cron Reminders</div>
            <div className="font-bold text-sm">Nodemailer Gmail</div>
            <p className="text-xs text-gray-700">Scheduled deadline &amp; revisit triggers via dev worker.</p>
          </Card>
          <Card padding="sm" className="space-y-1">
            <div className="font-mono text-xs font-bold text-black uppercase">Share Security</div>
            <div className="font-bold text-sm">Cryptographic Tokens</div>
            <p className="text-xs text-gray-700">32-byte tokens, password scrypt hash, owner moderation.</p>
          </Card>
        </div>
      ),
    },
    {
      id: 7,
      badge: "SUMMARY & MISSION",
      title: "THE UNBIAS: CLEAR REASONING",
      subtitle: "Empowering human agency with accountable AI.",
      render: () => (
        <div className="space-y-6 text-center max-w-2xl mx-auto py-8">
          <div className="w-16 h-16 bg-[#FFE600] border-[3px] border-black shadow-[4px_4px_0_#000] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
          <h3
            className="text-3xl sm:text-5xl font-black uppercase text-black"
            style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
          >
            DECIDE WITH CONFIDENCE MATCHED TO EVIDENCE.
          </h3>
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            The Unbias doesn&apos;t replace judgment. It makes judgment inspectable, measurable, and owned.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Button href="/signup" variant="primary" size="lg">
              Launch Workspace →
            </Button>
            <Button href="/" variant="secondary" size="lg">
              Visit Homepage
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((c) => c + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide((c) => c - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide]);

  const current = slides[currentSlide];

  return (
    <div className="min-h-screen bg-[#FFE600] flex flex-col justify-between p-4 sm:p-8 font-sans select-none">
      {/* Top Deck Navigation */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white border-2 border-black px-3 py-1.5 font-mono text-xs font-bold uppercase shadow-[2px_2px_0_#000] hover:bg-yellow-100 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Exit Presentation</span>
        </Link>
        <div className="font-mono text-xs font-bold bg-black text-[#FFE600] px-3 py-1.5 border-2 border-black shadow-[2px_2px_0_#000]">
          SLIDE 0{currentSlide + 1} / 0{slides.length}
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="max-w-5xl mx-auto w-full my-auto">
        <Card className="min-h-[520px] flex flex-col justify-between border-[4px] border-black shadow-[10px_10px_0_#000] p-6 sm:p-12 relative">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs font-bold uppercase bg-[#FFE600] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000]">
                {current.badge}
              </span>
              <span className="font-mono text-xs text-gray-500 font-bold hidden sm:inline">
                USE ARROW KEYS OR BUTTONS BELOW
              </span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black"
              style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
            >
              {current.title}
            </h1>
            {current.subtitle && (
              <p className="text-base sm:text-lg font-medium text-gray-700 mt-2">
                {current.subtitle}
              </p>
            )}
          </div>

          <div className="my-auto">{current.render()}</div>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 pt-6 border-t-2 border-black/10">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 border-2 border-black transition-all ${
                  idx === currentSlide
                    ? "bg-[#E10600] scale-125"
                    : "bg-white hover:bg-yellow-200"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full mt-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Previous Slide
        </Button>

        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-7 h-7 text-xs font-mono font-bold border-2 border-black shadow-[2px_2px_0_#000] transition-colors ${
                i === currentSlide ? "bg-black text-[#FFE600]" : "bg-white text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          icon={<ArrowRight className="w-4 h-4 ml-1" />}
        >
          Next Slide
        </Button>
      </div>
    </div>
  );
}
