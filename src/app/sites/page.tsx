"use client";

import { useState } from "react";
import Link from "next/link";
import { useSites } from "@/lib/hooks";

type Site = {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  recentPageviews: number;
};

export default function SitesPage() {
  const { data: sites, mutate, isLoading } = useSites();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    await fetch("/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain }),
    });
    setName("");
    setDomain("");
    setShowForm(false);
    setCreating(false);
    mutate();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your sites</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track your websites</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
        >
          + Add site
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add a new site</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="My App"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="example.com"
                required
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create site"}
            </button>
          </div>
        </form>
      )}

      {isLoading && (
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-gray-100 bg-white p-6">
              <div className="h-5 w-32 rounded bg-gray-200 mb-2" />
              <div className="h-4 w-48 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {sites && (
        <div className="grid gap-4">
          {(sites as Site[]).map((site) => (
            <Link
              key={site.id}
              href={`/sites/${site.id}`}
              className="group rounded-xl border border-gray-100 bg-white p-6 hover:shadow-md hover:border-emerald-100 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {site.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-gray-500">{site.domain}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{site.recentPageviews.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">pageviews (24h)</p>
                </div>
              </div>
            </Link>
          ))}

          {(sites as Site[]).length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <svg className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No sites yet</h3>
              <p className="mt-1 text-sm text-gray-500">Add one to start tracking.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
