import React from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header user={user} />
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full space-y-6">
        <h1
          className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black"
          style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
        >
          CONTACT & SUPPORT
        </h1>

        <Card className="space-y-6 text-center py-10">
          <div className="w-16 h-16 bg-[#FFE600] border-[3px] border-black shadow-[4px_4px_0_#000] mx-auto flex items-center justify-center">
            <Mail className="w-8 h-8 text-black stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold uppercase text-black">
              Questions, Feedback, or Bug Reports?
            </h2>
            <p className="text-sm font-medium text-gray-700 max-w-md mx-auto">
              Our engineering team is actively testing and improving The Unbias decision audit workspace. Reach out directly anytime.
            </p>
          </div>

          <div>
            <Button
              href="mailto:support@theunbias.com"
              variant="primary"
              size="lg"
            >
              Email support@theunbias.com
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

