import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Zap, AlertTriangle, Eye, Compass } from "lucide-react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Button } from "@/components/brutal/Button";
import { Card } from "@/components/brutal/Card";
import { Chip } from "@/components/brutal/Chip";
import { HeroGraphic } from "@/components/brutal/HeroGraphic";
import { OfflineBanner } from "@/components/brutal/OfflineBanner";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col">
      <OfflineBanner />
      <Header user={user} />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-black text-[#FFE600] px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black shadow-[3px_3px_0_#000]">
                <Zap className="w-4 h-4 text-[#FFE600]" />
                <span>AI Decision-Audit Workspace · No AI Verdicts</span>
              </div>

              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-[1.05]"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                MAKE BIG DECISIONS HARDER TO FOOL YOURSELF ABOUT.
              </h1>

              <p className="text-lg sm:text-xl font-medium text-gray-900 max-w-2xl leading-relaxed">
                The Unbias turns a messy decision into a structured reasoning map, surfaces
                your hidden assumptions, overlooked evidence gaps, and failure modes —{" "}
                <span className="font-bold underline decoration-[#E10600] decoration-4">
                  without ever choosing for you.
                </span>
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                {user ? (
                  <Button href="/dashboard" variant="primary" size="lg">
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button href="/signup" variant="primary" size="lg">
                    <span>Inspect a Decision</span>
                    <ArrowRight className="w-5 h-5 ml-1" />
                  </Button>
                )}
                <Button href="#how-it-works" variant="secondary" size="lg">
                  See How It Works
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-mono font-bold uppercase text-black/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>No AI recommendations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Strict Data Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Evidence Kanban</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <HeroGraphic />
            </div>
          </div>
        </section>

        {/* MARQUEE STRIP */}
        <div className="bg-black text-[#FFE600] border-y-[3px] border-black py-3 overflow-hidden select-none">
          <div className="flex gap-8 whitespace-nowrap font-mono text-sm font-bold uppercase tracking-widest animate-none">
            <span>★ ACCEPT 6-MONTH INTERNSHIP?</span>
            <span>·</span>
            <span>HIRE HEAD OF SALES OR WAIT A QUARTER?</span>
            <span>·</span>
            <span>RELOCATE FOR NEW JOB OFFER?</span>
            <span>·</span>
            <span>DROP OUT OR COMPLETE DEGREE?</span>
            <span>·</span>
            <span>BOOTSTRAP VS VENTURE FUNDING?</span>
            <span>·</span>
            <span>AUDIT YOUR REASONING FIRST</span>
          </div>
        </div>

        {/* HOW IT WORKS (3 STEPS) */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-mono text-xs font-bold bg-[#FFE600] px-3 py-1 border-2 border-black shadow-[2px_2px_0_#000] uppercase">
              METHODOLOGY
            </span>
            <h2
              className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black mt-4"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              HOW THE UNBIAS AUDITS YOUR THINKING
            </h2>
            <p className="mt-3 text-base sm:text-lg font-medium text-gray-800">
              Generic AI chat hands you a pre-baked verdict. We do the opposite: we help you
              inspect the reasoning you were already smuggling in.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-4xl font-black text-black"
                    style={{ fontFamily: "var(--font-archivo-black)" }}
                  >
                    01
                  </span>
                  <Chip variant="yellow">CANVAS</Chip>
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">
                  Frame Your Decision
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Enter your options, underlying reasons, non-negotiables, affected people,
                  and your current confidence slider (0–100). Never stare at an empty AI chat prompt.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black font-mono text-xs font-bold text-gray-600">
                OUTPUT: Structured reasoning baseline
              </div>
            </Card>

            {/* Step 2 */}
            <Card hover className="flex flex-col justify-between bg-yellow-50">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-4xl font-black text-[#E10600]"
                    style={{ fontFamily: "var(--font-archivo-black)" }}
                  >
                    02
                  </span>
                  <Chip variant="red">AUDIT MAP</Chip>
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">
                  Inspect Blind Spots
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  The AI explores your reasoning graph, finding unexamined assumptions,
                  evidence gaps, and red-team counterarguments—quoting your own words as evidence.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black font-mono text-xs font-bold text-gray-600">
                OUTPUT: 4–7 grounded blind-spot cards
              </div>
            </Card>

            {/* Step 3 */}
            <Card hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-4xl font-black text-black"
                    style={{ fontFamily: "var(--font-archivo-black)" }}
                  >
                    03
                  </span>
                  <Chip variant="green">EXECUTION</Chip>
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">
                  Act With Real Evidence
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Turn vulnerabilities into concrete Evidence Actions in a Kanban board.
                  Run a pre-mortem failure simulation, track your Readiness Score, and export a clean report.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t-2 border-black font-mono text-xs font-bold text-gray-600">
                OUTPUT: Readiness score & action plan
              </div>
            </Card>
          </div>
        </section>

        {/* EXAMPLE CARDS GRID */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2.5 py-1 border border-black">
                LIVE EXAMPLES
              </span>
              <h2
                className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-black mt-2"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                WHAT AN AUDIT ACTUALLY SURFACES
              </h2>
            </div>
            <p className="text-sm font-medium text-gray-700 max-w-md">
              Every card quotes what you wrote, shows an honest confidence label, and
              proposes a concrete verification action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Hidden Assumption */}
            <Card hover padding="sm" className="space-y-3">
              <div className="flex justify-between items-center">
                <Chip variant="amber">ASSUMPTION</Chip>
                <span className="text-[10px] font-mono font-bold text-gray-500">
                  CONFIDENCE: MED
                </span>
              </div>
              <h4 className="font-bold text-sm uppercase">
                Brand Prestige = Good Mentorship
              </h4>
              <div className="bg-yellow-100/60 p-2 border-l-2 border-black text-xs italic font-medium">
                &ldquo;It&apos;s a known tech company so I will learn a lot.&rdquo;
              </div>
              <p className="text-xs text-gray-800">
                Team placement dictates learning far more than company brand. Have you spoken to your actual team?
              </p>
              <div className="pt-2 border-t border-gray-200 text-[11px] font-mono font-bold text-[#E10600]">
                → ACTION: Ask hiring manager for 15-min mentor intro
              </div>
            </Card>

            {/* Card 2: Evidence Gap */}
            <Card hover padding="sm" className="space-y-3">
              <div className="flex justify-between items-center">
                <Chip variant="blue">EVIDENCE GAP</Chip>
                <span className="text-[10px] font-mono font-bold text-gray-500">
                  CONFIDENCE: HIGH
                </span>
              </div>
              <h4 className="font-bold text-sm uppercase">
                Academic Policy on Full-Time Hours
              </h4>
              <div className="bg-sky-100/60 p-2 border-l-2 border-black text-xs italic font-medium">
                &ldquo;College won&apos;t mind as long as exams are passed.&rdquo;
              </div>
              <p className="text-xs text-gray-800">
                You have not verified mandatory 75% lab attendance rules for final semester.
              </p>
              <div className="pt-2 border-t border-gray-200 text-[11px] font-mono font-bold text-[#E10600]">
                → ACTION: Check departmental dean syllabus notice
              </div>
            </Card>

            {/* Card 3: Future Consequence */}
            <Card hover padding="sm" className="space-y-3">
              <div className="flex justify-between items-center">
                <Chip variant="red">REVERSIBILITY</Chip>
                <span className="text-[10px] font-mono font-bold text-gray-500">
                  CONFIDENCE: MED
                </span>
              </div>
              <h4 className="font-bold text-sm uppercase">
                Contract Lock-in Clause
              </h4>
              <div className="bg-red-100/60 p-2 border-l-2 border-black text-xs italic font-medium">
                &ldquo;I can always quit if workload gets too heavy.&rdquo;
              </div>
              <p className="text-xs text-gray-800">
                Notice period is 60 days with penalty bond. Quitting mid-term is not low-friction.
              </p>
              <div className="pt-2 border-t border-gray-200 text-[11px] font-mono font-bold text-[#E10600]">
                → ACTION: Review termination clause before signing
              </div>
            </Card>

            {/* Card 4: Pre-Mortem Risk */}
            <Card hover padding="sm" className="space-y-3 bg-black text-[#FFE600] border-[3px] border-black">
              <div className="flex justify-between items-center">
                <span className="bg-[#FFE600] text-black text-[10px] font-mono font-bold px-1.5 py-0.5 border border-black">
                  PRE-MORTEM RISK
                </span>
                <span className="text-[10px] font-mono text-yellow-300">
                  IMPACT: 5/5
                </span>
              </div>
              <h4 className="font-bold text-sm uppercase text-[#FFE600]">
                Burnout At Month 3 Midterms
              </h4>
              <div className="bg-zinc-800 p-2 border-l-2 border-[#FFE600] text-xs italic text-gray-300">
                &ldquo;I can handle 40 hours work + 20 hours study.&rdquo;
              </div>
              <p className="text-xs text-gray-300">
                Simulating project collapse: simultaneous exam week and client sprint deadline.
              </p>
              <div className="pt-2 border-t border-zinc-700 text-[11px] font-mono font-bold text-[#FFE600]">
                → MITIGATION: Negotiate 3 study days buffer in contract
              </div>
            </Card>
          </div>
        </section>

        {/* TRUST STRIP BANNER */}
        <section className="my-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white border-[4px] border-black shadow-[8px_8px_0_#000] p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#E10600] text-white px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black shadow-[2px_2px_0_#000]">
                <ShieldCheck className="w-4 h-4" />
                <span>NON-NEGOTIABLE PRINCIPLE</span>
              </div>
              <h3
                className="text-3xl sm:text-5xl font-black uppercase text-black"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                THE UNBIAS NEVER DECIDES FOR YOU.
              </h3>
              <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
                We believe your decisions belong to you. There is no &ldquo;AI picks&rdquo; button, no
                option ranking totals, and no judgment labels on your character. Success is not
                higher confidence—it is confidence that matches your real evidence.
              </p>
              <div className="pt-4">
                <Button href="/about" variant="secondary" size="md">
                  Read Our Reasoning Manifesto
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
          <h2
            className="text-3xl sm:text-5xl font-black uppercase text-black"
            style={{ fontFamily: "var(--font-archivo-black)" }}
          >
            START WITH ONE DECISION YOU ARE CARRYING AROUND.
          </h2>
          <p className="text-gray-900 text-lg font-medium max-w-xl mx-auto">
            You don&apos;t need to know the answer yet. Put your thoughts on the canvas and see what surfaces.
          </p>
          <div className="pt-2">
            {user ? (
              <Button href="/decisions/new" variant="primary" size="lg">
                Inspect a New Decision →
              </Button>
            ) : (
              <Button href="/signup" variant="primary" size="lg">
                Create Free Workspace →
              </Button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

