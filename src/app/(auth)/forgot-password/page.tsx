"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Logo } from "@/components/brutal/Logo";
import { createClient } from "@/lib/supabase/client";
import { Mail, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to send password reset email.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFE600] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-grid">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="inline-block mb-4 hover:scale-105 transition-transform">
            <Logo size="lg" />
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black font-display">
            RESET PASSWORD
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wider text-black/80 font-mono">
            WE&apos;LL SEND YOU A SECURE RECOVERY LINK
          </p>
        </div>

        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-[#E10600] text-black flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E10600] shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0_#000]">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">CHECK YOUR INBOX</h2>
              <p className="text-sm text-gray-700">
                A password reset link has been dispatched to <span className="font-bold text-black">{email}</span>. Click the link to choose a new password.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E10600] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Log In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Account Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? "SENDING LINK..." : "SEND RECOVERY EMAIL"}
              </Button>

              <div className="pt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black hover:text-[#E10600] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Log In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
