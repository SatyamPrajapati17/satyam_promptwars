import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-white border-t-[3px] border-black py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <Logo size="md" />
          <p className="mt-2 text-sm font-medium text-gray-700 max-w-sm">
            See the decision you are actually making. An AI decision-audit workspace
            that never decides for you.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider">
          <Link href="/about" className="hover:text-[#E10600] transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-[#E10600] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#E10600] transition-colors">
            Terms of Service
          </Link>
          <a
            href="mailto:support@theunbias.com"
            className="hover:text-[#E10600] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600">
        <div>
          © {new Date().getFullYear()} The Unbias. Brutalist Reasoning System.
        </div>
        <div className="bg-[#FFE600] text-black px-2 py-0.5 border border-black font-bold uppercase">
          Private by default · No recommendations
        </div>
      </div>
    </footer>
  );
}

