"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Site = { id: string; name: string; domain: string };

export default function SettingsPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const router = useRouter();
  const { data: site, mutate } = useSWR<Site>(`/api/sites/${siteId}`, fetcher);

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [confirmName, setConfirmName] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (site && !name && !domain) {
    setName(site.name);
    setDomain(site.domain);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch(`/api/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, domain }),
    });
    await mutate();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (confirmName !== site?.name) return;
    setDeleting(true);
    await fetch(`/api/sites/${siteId}`, { method: "DELETE" });
    router.push("/sites");
  }

  if (!site) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-32 rounded bg-stone-200" />
          <div className="h-40 rounded-xl bg-stone-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      <h1 className="mb-6 text-2xl font-bold text-stone-900">Settings</h1>

      {/* General */}
      <form onSubmit={handleSave} className="mb-8 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-stone-900">General</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Site name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Domain</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              required
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
          {saved && (
            <span className="text-sm text-orange-600">Saved</span>
          )}
        </div>
      </form>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold text-red-600">Danger zone</h2>
        <p className="mb-4 text-sm text-stone-500">
          Deleting this site will permanently remove all events, dashboards, and widgets. This cannot be undone.
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-stone-700 mb-1">
              Type <span className="font-mono font-semibold">{site.name}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-red-400"
              placeholder={site.name}
            />
          </div>
          <button
            onClick={handleDelete}
            disabled={confirmName !== site.name || deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete site"}
          </button>
        </div>
      </div>
    </div>
  );
}
