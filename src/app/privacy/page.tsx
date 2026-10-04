import React from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Card } from "@/components/brutal/Card";
import { createClient } from "@/lib/supabase/server";

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header user={user} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-6">
        <h1
          className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black"
          style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
        >
          PRIVACY & DATA OWNERSHIP
        </h1>

        <Card className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-800">
          <div className="p-3 bg-[#FFE600] border-2 border-black font-mono font-bold text-xs uppercase shadow-[2px_2px_0_#000]">
            SUMMARY: YOUR DECISION TEXT IS PRIVATE TO YOUR ACCOUNT. WE NEVER SELL OR TRAIN PUBLIC MODELS ON YOUR REASONING.
          </div>

          <h2 className="text-lg font-black uppercase text-black pt-2">1. Private by Default</h2>
          <p>
            All decision titles, questions, options, reasons, personal impact notes, and private reflections
            are stored in isolated PostgreSQL tables protected by Row Level Security (RLS). Only your authenticated
            user account has read and write permissions to your data.
          </p>

          <h2 className="text-lg font-black uppercase text-black pt-2">2. AI Processing</h2>
          <p>
            When you trigger an audit analysis, decision content is sent to our server-side inference pipeline solely
            to extract reasoning maps, blind-spot cards, and pre-mortem clusters. AI processing runs in zero-retention
            mode and is never used to train third-party foundation models.
          </p>

          <h2 className="text-lg font-black uppercase text-black pt-2">3. Anonymized Metrics Mirror</h2>
          <p>
            Aggregate system telemetry (such as total decisions examined, broad category counts, and average readiness numbers)
            is cryptographically hashed before being mirrored to external analytical sheets. Personal identifying information (names, emails,
            raw decision text, specific notes) is strictly excluded.
          </p>

          <h2 className="text-lg font-black uppercase text-black pt-2">4. Your Right to Delete</h2>
          <p>
            You may export all your decision workspace data in JSON format or trigger a permanent hard delete of your account
            at any time from the Settings dashboard. Deletion immediately cascades across all decision tables.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
