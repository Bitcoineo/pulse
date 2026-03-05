"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

type Site = { id: string; name: string; domain: string };

const tabs = [
  { label: "Dashboard", path: "" },
  { label: "Events", path: "/events" },
  { label: "Import", path: "/import" },
  { label: "Settings", path: "/settings" },
];

export default function SiteNav({ siteId }: { siteId: string }) {
  const pathname = usePathname();
  const { data: site } = useSWR<Site>(`/api/sites/${siteId}`, fetcher);

  function isActive(tabPath: string) {
    if (!pathname) return false;
    const full = `/sites/${siteId}${tabPath}`;
    if (tabPath === "") return pathname === full;
    return pathname.startsWith(full);
  }

  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="py-4">
          <h1 className="text-lg font-bold text-stone-900">
            {site?.name || "Loading..."}
          </h1>
          <p className="text-sm text-stone-500 font-mono">{site?.domain}</p>
        </div>
        <nav className="-mb-px flex gap-6">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              href={`/sites/${siteId}${tab.path}`}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                isActive(tab.path)
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
