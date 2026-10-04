"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Logo } from "@/components/brutal/Logo";
import { createClient } from "@/lib/supabase/client";
import { UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // If email confirmation is disabled or auto-confirmed, session is present immediately!
      if (data?.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      // Otherwise show confirmation instructions
      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during signup.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${origin}/auth/confirm?next=/dashboard`,
        },
      });
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Failed to resend confirmation email.");
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
            CREATE AN AUDIT ACCOUNT
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wider text-black/80 font-mono">
            WE WILL NEVER DECIDE FOR YOU. EVER.
          </p>
        </div>

        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-[#E10600] text-black flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E10600] shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {success ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0_#000]">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight font-display">
                CHECK YOUR INBOX
              </h2>
              <p className="text-sm text-gray-700">
                We sent a confirmation link to <span className="font-bold text-black">{email}</span>.
                Click the link in that email to activate your account and enter the dashboard.
              </p>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="w-full"
                >
                  {resendCooldown > 0
                    ? `RESEND IN ${resendCooldown}s`
                    : "RESEND CONFIRMATION EMAIL"}
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-[#E10600] hover:underline"
                >
                  Back to Log In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Satyam Prajapati"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Work / Personal Email
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

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Password (8+ chars)
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full"
                />
              </div>

              <div className="p-3 bg-yellow-50 border-2 border-black text-xs font-medium text-black/90 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-black mt-0.5" />
                <span>
                  <strong>Strict Privacy:</strong> Your decisions remain confidential. Our AI analyzes reasoning gaps and blind spots without storing your training data.
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full mt-2"
              >
                {loading ? "CREATING ACCOUNT..." : "START AUDITING DECISIONS"}
              </Button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t-2 border-black text-center text-xs font-bold uppercase tracking-wider">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#E10600] underline font-black hover:text-black transition-colors"
            >
              Log in here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
