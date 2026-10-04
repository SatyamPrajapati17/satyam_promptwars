import React from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Card } from "@/components/brutal/Card";
import { createClient } from "@/lib/supabase/server";

export default async function TermsPage() {
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
          TERMS OF SERVICE
        </h1>

        <Card className="space-y-4 text-sm sm:text-base leading-relaxed text-gray-800">
          <div className="p-3 bg-red-100 border-2 border-black font-mono font-bold text-xs uppercase text-red-900 shadow-[2px_2px_0_#000]">
            IMPORTANT NOTICE: THE UNBIAS DOES NOT PROVIDE LEGAL, MEDICAL, FINANCIAL, OR CLINICAL PSYCHOLOGICAL ADVICE.
          </div>

          <h2 className="text-lg font-black uppercase text-black pt-2">1. Nature of the Service</h2>
          <p>
            The Unbias is a critical thinking and decision-audit software tool designed to assist individuals in examining
            their own stated reasons, assumptions, and potential blind spots. The software does not provide professional,
            fiduciary, investment, medical, or legal counsel.
          </p>

          <h2 className="text-lg font-black uppercase text-black pt-2">2. User Responsibility & Agency</h2>
          <p>
            You acknowledge and agree that all decisions made, actions undertaken, and outcomes resulting from your use of
            The Unbias remain exclusively your own responsibility. The Unbias intentionally provides hypotheses and questions
            rather than answers or recommendations.
          </p>

          <h2 className="text-lg font-black uppercase text-black pt-2">3. Acceptable Use</h2>
          <p>
            You agree not to submit unlawful, abusive, infringing, or confidential trade secret information. Automated scraping
            or excessive denial-of-service queries against our analysis pipelines are strictly prohibited.
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
