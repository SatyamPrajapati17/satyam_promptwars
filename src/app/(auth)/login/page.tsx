"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Logo } from "@/components/brutal/Logo";
import { createClient } from "@/lib/supabase/client";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === "auth_callback_failed"
      ? "Authentication callback failed. Please try again."
      : errorParam === "verification_failed"
      ? "Verification link expired or invalid."
      : null
  );
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login credentials")) {
          setError("Wrong email or password. Please verify and try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          setError("Email not confirmed yet. Check your inbox for the confirmation link.");
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login.");
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`,
        },
      });

      if (otpError) {
        setError(otpError.message);
        setLoading(false);
        return;
      }

      setMagicLinkSent(true);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || "Failed to send magic link.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
    } catch (err: any) {
      setError("Failed to initiate Google authentication.");
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
            AUDIT YOUR THINKING
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wider text-black/80 font-mono">
            LOG IN TO YOUR DECISION WORKSPACE
          </p>
        </div>

        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-[#E10600] text-black flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E10600] shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {magicLinkSent ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0_#000]">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">CHECK YOUR INBOX</h2>
              <p className="text-sm text-gray-700">
                We sent a magic sign-in link to <span className="font-bold text-black">{email}</span>. Click the link to log in immediately.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setMagicLinkSent(false)}
                className="mt-4"
              >
                Use Password Instead
              </Button>
            </div>
          ) : (
            <>
              <div className="flex border-2 border-black mb-6 bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode("password")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                    mode === "password"
                      ? "bg-white border-2 border-black shadow-[2px_2px_0_#000] text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setMode("magic")}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                    mode === "magic"
                      ? "bg-white border-2 border-black shadow-[2px_2px_0_#000] text-black"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Magic Link
                </button>
              </div>

              {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && (
                <div className="mb-6">
                  <Button
                    variant="secondary"
                    size="md"
                    className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-black shadow-[3px_3px_0_#000]"
                    onClick={handleGoogleLogin}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-black"></div>
                    </div>
                    <span className="relative bg-white px-3 text-xs font-black uppercase text-gray-500">
                      Or with email
                    </span>
                  </div>
                </div>
              )}

              {mode === "password" ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Email Address
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
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-black uppercase tracking-wider">
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-bold text-[#E10600] hover:underline"
                      >
                        Forgot?
                      </Link>
                    </div>
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

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="w-full mt-2"
                  >
                    {loading ? "LOGGING IN..." : "ENTER WORKSPACE"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                      Email Address
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
                    {loading ? "SENDING LINK..." : "SEND MAGIC LINK"}
                  </Button>
                </form>
              )}
            </>
          )}

          <div className="mt-8 pt-6 border-t-2 border-black text-center text-xs font-bold uppercase tracking-wider">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#E10600] underline font-black hover:text-black transition-colors"
            >
              Sign up here
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFE600] flex items-center justify-center font-mono font-bold">
          LOADING AUDIT LOGIN...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

