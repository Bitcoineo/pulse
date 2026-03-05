"use client";

import { useState } from "react";
import { subDays, format } from "date-fns";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import DateRangePicker from "@/components/DateRangePicker";
import { SkeletonTable } from "@/components/Skeleton";

type Event = {
  id: string;
  name: string;
  path: string;
  referrer: string | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  country: string | null;
  duration: number | null;
  revenue: number | null;
  timestamp: string;
};

type EventsResponse = {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
};

const columns = [
  { key: "timestamp", label: "Time", w: "w-40" },
  { key: "name", label: "Event", w: "w-24" },
  { key: "path", label: "Path", w: "flex-1" },
  { key: "referrer", label: "Referrer", w: "w-32" },
  { key: "browser", label: "Browser", w: "w-20" },
  { key: "os", label: "OS", w: "w-20" },
  { key: "device", label: "Device", w: "w-20" },
  { key: "country", label: "Country", w: "w-16" },
  { key: "duration", label: "Duration", w: "w-20" },
  { key: "revenue", label: "Revenue", w: "w-20" },
];

const eventTypes = [
  { value: "", label: "All events" },
  { value: "pageview", label: "Pageview" },
  { value: "click", label: "Click" },
  { value: "signup", label: "Signup" },
  { value: "purchase", label: "Purchase" },
];

const eventColors: Record<string, string> = {
  pageview: "bg-orange-100 text-orange-700",
  click: "bg-blue-100 text-blue-700",
  signup: "bg-purple-100 text-purple-700",
  purchase: "bg-amber-100 text-amber-700",
};

export default function EventsPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("timestamp");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [startDate, setStartDate] = useState(subDays(new Date(), 30).toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: "50",
    sort,
    order,
    start: startDate,
    end: endDate,
  });
  if (type) queryParams.set("type", type);
  if (search) queryParams.set("search", search);

  const { data, isLoading, error, mutate } = useSWR<EventsResponse>(
    `/api/sites/${siteId}/events?${queryParams}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  function handleSort(col: string) {
    if (sort === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(col);
      setOrder("desc");
    }
    setPage(1);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleDateChange(start: string, end: string) {
    setStartDate(start);
    setEndDate(end);
    setPage(1);
  }

  function handleExport() {
    const exportParams = new URLSearchParams({ start: startDate, end: endDate });
    if (type) exportParams.set("type", type);
    if (search) exportParams.set("search", search);
    window.open(`/api/sites/${siteId}/events/export?${exportParams}`, "_blank");
  }

  const activeFilters: string[] = [];
  if (type) activeFilters.push(eventTypes.find((e) => e.value === type)?.label || type);
  if (search) activeFilters.push(`"${search}"`);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-4 space-y-3 sm:mb-6 sm:flex sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">Events</h1>
          {data && (
            <p className="text-sm text-stone-500">
              <span className="font-mono">{data.total.toLocaleString()}</span> events
              {activeFilters.length > 0 && (
                <span className="ml-2">
                  {activeFilters.map((f, i) => (
                    <span key={i} className="inline-flex items-center rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-700 ml-1">
                      {f}
                    </span>
                  ))}
                </span>
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleExport}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            Export CSV
          </button>
          <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center gap-2">
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
          >
            {eventTypes.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {(type || search) && (
            <button
              onClick={() => { setType(""); setSearch(""); setSearchInput(""); setPage(1); }}
              className="text-sm text-stone-500 hover:text-stone-700 whitespace-nowrap"
            >
              Clear
            </button>
          )}
        </div>
        <form onSubmit={handleSearch} className="flex-1 sm:max-w-xs">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search paths, referrers..."
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-stone-100 bg-white overflow-hidden">
        {error ? (
          <div className="p-6 flex items-center justify-between">
            <p className="text-sm text-stone-400">Failed to load. Refresh or try a different range.</p>
            <button onClick={() => mutate()} className="rounded-lg px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">Retry</button>
          </div>
        ) : isLoading && !data ? (
          <div className="p-6">
            <SkeletonTable rows={10} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  {columns.map((col) => {
                    const hideMobile = ["browser", "os", "device", "country"].includes(col.key);
                    return (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className={`cursor-pointer px-3 py-3 text-left text-xs font-medium uppercase text-stone-500 hover:text-stone-700 select-none sm:px-4 ${hideMobile ? "hidden sm:table-cell" : ""}`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {col.label}
                        {sort === col.key && (
                          <span className="text-orange-500">{order === "asc" ? "\u2191" : "\u2193"}</span>
                        )}
                      </span>
                    </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {data?.events.map((event, i) => (
                  <tr key={event.id} className={`border-b border-stone-50 hover:bg-stone-50/50 ${i % 2 === 1 ? "bg-stone-50/30" : ""}`}>
                    <td className="px-3 py-2.5 text-stone-500 whitespace-nowrap font-mono text-xs sm:px-4">
                      {format(new Date(event.timestamp), "MMM d, HH:mm:ss")}
                    </td>
                    <td className="px-3 py-2.5 sm:px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${eventColors[event.name] || "bg-stone-100 text-stone-700"}`}>
                        {event.name}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-stone-900 font-mono text-xs sm:px-4">{event.path}</td>
                    <td className="px-3 py-2.5 text-stone-500 truncate max-w-[120px] sm:px-4">{event.referrer || "-"}</td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-stone-500">{event.browser || "-"}</td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-stone-500">{event.os || "-"}</td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-stone-500">{event.device || "-"}</td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-stone-500">{event.country || "-"}</td>
                    <td className="px-3 py-2.5 text-stone-500 font-mono tabular-nums text-xs sm:px-4">
                      {event.duration != null ? `${event.duration}s` : "-"}
                    </td>
                    <td className="px-3 py-2.5 text-stone-500 font-mono tabular-nums text-xs sm:px-4">
                      {event.revenue != null ? `$${(event.revenue / 100).toFixed(2)}` : "-"}
                    </td>
                  </tr>
                ))}
                {data?.events.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-stone-400">
                      No events match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-stone-100 px-3 py-3 sm:px-4">
            <p className="text-xs text-stone-500 sm:text-sm">
              <span className="font-mono">{data.page}</span>/<span className="font-mono">{data.totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-lg px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed sm:px-3"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                let pageNum: number;
                if (data.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= data.totalPages - 2) {
                  pageNum = data.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium font-mono ${
                      pageNum === page
                        ? "bg-orange-50 text-orange-600"
                        : "text-stone-600 hover:bg-stone-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(data.totalPages, page + 1))}
                disabled={page >= data.totalPages}
                className="rounded-lg px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
