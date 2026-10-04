"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/brutal/Button";
import { Input } from "@/components/brutal/Input";
import { Logo } from "@/components/brutal/Logo";
import { createClient } from "@/lib/supabase/client";
import { Lock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      setDone(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to update password.");
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
            SET NEW PASSWORD
          </h1>
          <p className="mt-1 text-sm font-bold uppercase tracking-wider text-black/80 font-mono">
            SECURE YOUR ACCOUNT CREDENTIALS
          </p>
        </div>

        <Card variant="default" className="p-8 bg-white border-4 border-black shadow-[8px_8px_0_#000]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-[#E10600] text-black flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E10600] shrink-0 mt-0.5" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {done ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#FFE600] border-3 border-black mx-auto flex items-center justify-center shadow-[4px_4px_0_#000]">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">PASSWORD UPDATED!</h2>
              <p className="text-sm text-gray-700">
                Your password has been changed. Redirecting you to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  New Password (8+ chars)
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

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "SAVING..." : "UPDATE PASSWORD"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
