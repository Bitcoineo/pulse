"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/sites" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 16 8 10 12 14 16 8 20 12" />
            </svg>
          </div>
          <span className="text-lg font-bold text-stone-900">Pulse</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg px-3 py-1.5 text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
