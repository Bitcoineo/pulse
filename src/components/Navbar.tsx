"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link href="/sites" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">Pulse</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Sign out
        </button>
      </div>
    </nav>
  );
}
