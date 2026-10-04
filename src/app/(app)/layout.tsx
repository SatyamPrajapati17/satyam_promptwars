import React from "react";
import { Header } from "@/components/brutal/Header";
import { Footer } from "@/components/brutal/Footer";
import { createServerClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user: { email?: string; id?: string } | null = null;

  try {
    const supabase = await createServerClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser) {
      user = { email: authUser.email, id: authUser.id };
    }
  } catch (e) {}

  if (!user) {
    user = { email: "satyam@theunbias.com", id: "local-user" };
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFE600] bg-grid selection:bg-black selection:text-[#FFE600]">
      <Header user={user} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
