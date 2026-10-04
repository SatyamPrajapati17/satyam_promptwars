import React from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { createClient } from "@/lib/supabase/server";

export default async function AboutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header user={user} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-8">
        <div>
          <span className="font-mono text-xs font-bold uppercase bg-black text-[#FFE600] px-2.5 py-1 border border-black shadow-[2px_2px_0_#000]">
            MANIFESTO
          </span>
          <h1
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-black mt-3"
            style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
          >
            SEE THE DECISION YOU ARE ACTUALLY MAKING.
          </h1>
        </div>

        <Card className="space-y-4 text-base sm:text-lg leading-relaxed font-medium">
          <p>
            When people make big decisions—about their career, education, relationships, or business—they
            often rely on intuition mixed with unexamined assumptions.
          </p>
          <p>
            Generic AI chat engines make this problem worse: they produce a polite verdict or a generic pros-and-cons
            list, giving the illusion of advice while leaving the user&apos;s true reasoning uninspected.
          </p>
          <div className="bg-[#FFE600] border-2 border-black p-4 font-bold text-black shadow-[3px_3px_0_#000]">
            &ldquo;The AI does not give you a better answer. It helps you notice the answer you were already smuggling in.&rdquo;
          </div>
          <p>
            The Unbias was designed with a strict non-negotiable principle: <strong>it never chooses for you</strong>.
            It constructs a rigorous reasoning map, red-teams your favorite option, challenges unverified claims,
            and turns uncertainty into an empirical action plan.
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-black text-xl uppercase mb-2">Core Principles</h3>
            <ul className="space-y-2 text-sm font-medium list-disc list-inside text-gray-800">
              <li>Hypotheses, not psychological diagnoses</li>
              <li>Every observation quotes your actual input</li>
              <li>Readiness score measures thoroughness, never an option</li>
              <li>Deterministic validation rules before display</li>
            </ul>
          </Card>
          <Card>
            <h3 className="font-black text-xl uppercase mb-2">Private & Owned</h3>
            <p className="text-sm font-medium text-gray-800">
              Your raw decision text lives solely inside your private database account.
              Analytics are strictly anonymized, and you retain complete rights to export or delete your workspace at any time.
            </p>
          </Card>
        </div>

        <div className="pt-4 text-center">
          <Button href="/signup" variant="primary" size="lg">
            Start Auditing Your Reasoning →
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

