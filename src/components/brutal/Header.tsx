"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Settings, BarChart2, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { createClient } from "@/lib/supabase/client";

export interface HeaderProps {
  user?: { email?: string; id?: string } | null;
}

export function Header({ user }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-[3px] border-black shadow-[0_4px_0_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#how-it-works"
            className="text-sm font-bold uppercase tracking-wider text-black hover:text-[#E10600] transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            className="text-sm font-bold uppercase tracking-wider text-black hover:text-[#E10600] transition-colors"
          >
            About
          </Link>

          {user ? (
            <div className="flex items-center gap-4 relative">
              <Button href="/dashboard" variant="primary" size="sm">
                Dashboard
              </Button>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 bg-[#FFE600] border-2 border-black font-mono font-bold flex items-center justify-center shadow-[2px_2px_0_#000] hover:bg-yellow-300 transition-colors uppercase"
                  aria-label="User menu"
                >
                  {user.email ? user.email.slice(0, 2).toUpperCase() : "ME"}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border-[3px] border-black shadow-[4px_4px_0_#000] py-2 z-50 flex flex-col">
                    <div className="px-4 py-2 border-b-2 border-black font-mono text-xs text-gray-600 truncate">
                      {user.email}
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="px-4 py-2 text-xs font-bold uppercase hover:bg-[#FFE600] flex items-center gap-2"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/analytics"
                      onClick={() => setUserMenuOpen(false)}
                      className="px-4 py-2 text-xs font-bold uppercase hover:bg-[#FFE600] flex items-center gap-2"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Analytics
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="px-4 py-2 text-xs font-bold uppercase hover:bg-[#FFE600] flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-xs font-bold uppercase text-[#E10600] hover:bg-red-50 flex items-center gap-2 border-t-2 border-black mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button href="/login" variant="secondary" size="sm">
                Log In
              </Button>
              <Button href="/signup" variant="primary" size="sm">
                Sign Up
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile menu hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {user && (
            <Button href="/dashboard" variant="primary" size="sm">
              Dashboard
            </Button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border-2 border-black bg-white shadow-[2px_2px_0_#000]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white p-4 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold uppercase text-sm border-b border-gray-200"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 font-bold uppercase text-sm border-b border-gray-200"
          >
            About
          </Link>

          {user ? (
            <div className="pt-2 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-bold uppercase text-sm"
              >
                Dashboard
              </Link>
              <Link
                href="/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-bold uppercase text-sm"
              >
                Analytics
              </Link>
              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 font-bold uppercase text-sm"
              >
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left py-2 font-bold uppercase text-sm text-[#E10600]"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-3">
              <Button
                href="/login"
                variant="secondary"
                size="md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Button>
              <Button
                href="/signup"
                variant="primary"
                size="md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

