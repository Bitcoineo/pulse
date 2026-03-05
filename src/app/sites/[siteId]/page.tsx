"use client";

import { useState } from "react";
import { subDays } from "date-fns";
import { useAnalytics } from "@/lib/hooks";
import DateRangePicker from "@/components/DateRangePicker";
import MetricCard from "@/components/MetricCard";
import AreaChartCard from "@/components/charts/AreaChartCard";
import DonutChartCard from "@/components/charts/DonutChartCard";
import BarChartCard from "@/components/charts/BarChartCard";
import RankingTable from "@/components/RankingTable";
import CountryTable from "@/components/CountryTable";
import { SkeletonCard, SkeletonChart, SkeletonTable } from "@/components/Skeleton";

type OverviewData = {
  totalPageviews: number;
  uniqueVisitors: number;
  avgDuration: number;
  bounceRate: number;
  totalRevenue: number;
  changes: {
    totalPageviews: number;
    uniqueVisitors: number;
    avgDuration: number;
    bounceRate: number;
    totalRevenue: number;
  };
};

type PageviewPoint = { date: string; count: number };
type PageRow = { path: string; count: number };
type ReferrerRow = { referrer: string; count: number };
type BreakdownRow = { count: number; percentage: number } & Record<string, unknown>;
type CountryRow = { country: string; count: number; percentage: number };
type RevenuePoint = { date: string; revenue: string | number; count: number };

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

function autoGranularity(startDate: string, endDate: string): "hour" | "day" | "week" {
  const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24);
  if (days <= 2) return "hour";
  if (days <= 90) return "day";
  return "week";
}

function ErrorCard({ mutate }: { mutate: () => void }) {
  return (
    <div className="rounded-xl border border-stone-100 bg-white p-6 flex items-center justify-between">
      <p className="text-sm text-stone-400">Failed to load. Try refreshing.</p>
      <button
        onClick={mutate}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

export default function DashboardPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const [startDate, setStartDate] = useState(subDays(new Date(), 30).toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());

  const granularity = autoGranularity(startDate, endDate);

  const { data: overview, error: overviewErr, mutate: overviewMutate } = useAnalytics<OverviewData>(siteId, "overview", startDate, endDate);
  const { data: pageviews, error: pageviewsErr, mutate: pageviewsMutate } = useAnalytics<PageviewPoint[]>(siteId, "pageviews", startDate, endDate, { granularity });
  const { data: pages, error: pagesErr, mutate: pagesMutate } = useAnalytics<PageRow[]>(siteId, "pages", startDate, endDate);
  const { data: referrers, error: referrersErr, mutate: referrersMutate } = useAnalytics<ReferrerRow[]>(siteId, "referrers", startDate, endDate);
  const { data: browsers, error: browsersErr, mutate: browsersMutate } = useAnalytics<BreakdownRow[]>(siteId, "browsers", startDate, endDate);
  const { data: devices, error: devicesErr, mutate: devicesMutate } = useAnalytics<BreakdownRow[]>(siteId, "devices", startDate, endDate);
  const { data: countries, error: countriesErr, mutate: countriesMutate } = useAnalytics<CountryRow[]>(siteId, "countries", startDate, endDate);
  const { data: revenue, error: revenueErr, mutate: revenueMutate } = useAnalytics<RevenuePoint[]>(siteId, "revenue", startDate, endDate);

  function handleDateChange(start: string, end: string) {
    setStartDate(start);
    setEndDate(end);
  }

  const hasRevenue = revenue && revenue.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-end">
        <DateRangePicker startDate={startDate} endDate={endDate} onChange={handleDateChange} />
      </div>

      {/* ROW 1: Metric cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewErr ? (
          <div className="sm:col-span-2 lg:col-span-4"><ErrorCard mutate={overviewMutate} /></div>
        ) : overview ? (
          <>
            <MetricCard
              label="Total Pageviews"
              value={overview.totalPageviews.toLocaleString()}
              change={overview.changes.totalPageviews}
            />
            <MetricCard
              label="Unique Visitors"
              value={overview.uniqueVisitors.toLocaleString()}
              change={overview.changes.uniqueVisitors}
            />
            <MetricCard
              label="Avg Duration"
              value={formatDuration(overview.avgDuration)}
              change={overview.changes.avgDuration}
            />
            <MetricCard
              label="Bounce Rate"
              value={`${overview.bounceRate}%`}
              change={overview.changes.bounceRate}
              invertChange
            />
          </>
        ) : (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {/* ROW 2: Pageviews over time */}
      <div className="mb-6">
        {pageviewsErr ? (
          <ErrorCard mutate={pageviewsMutate} />
        ) : pageviews ? (
          <AreaChartCard title="Pageviews Over Time" data={pageviews} />
        ) : (
          <SkeletonChart />
        )}
      </div>

      {/* ROW 3: Top Pages + Referrers */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pagesErr ? (
          <ErrorCard mutate={pagesMutate} />
        ) : pages ? (
          <RankingTable
            title="Top Pages"
            data={pages.map((p) => ({ label: p.path, count: p.count }))}
            labelHeader="Path"
            valueHeader="Views"
          />
        ) : (
          <SkeletonTable />
        )}
        {referrersErr ? (
          <ErrorCard mutate={referrersMutate} />
        ) : referrers ? (
          <RankingTable
            title="Top Referrers"
            data={referrers.map((r) => ({ label: r.referrer, count: r.count }))}
            labelHeader="Source"
            valueHeader="Views"
          />
        ) : (
          <SkeletonTable />
        )}
      </div>

      {/* ROW 4: Browser, Device, Country */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {browsersErr ? (
          <ErrorCard mutate={browsersMutate} />
        ) : browsers ? (
          <DonutChartCard
            title="Browsers"
            data={browsers.map((b) => ({ name: (b.browser as string) || "Unknown", count: b.count, percentage: b.percentage }))}
          />
        ) : (
          <SkeletonChart height="h-[280px]" />
        )}
        {devicesErr ? (
          <ErrorCard mutate={devicesMutate} />
        ) : devices ? (
          <DonutChartCard
            title="Devices"
            data={devices.map((d) => ({ name: (d.device as string) || "Unknown", count: d.count, percentage: d.percentage }))}
          />
        ) : (
          <SkeletonChart height="h-[280px]" />
        )}
        {countriesErr ? (
          <ErrorCard mutate={countriesMutate} />
        ) : countries ? (
          <CountryTable title="Countries" data={countries} />
        ) : (
          <SkeletonTable />
        )}
      </div>

      {/* ROW 5: Revenue (conditional) */}
      {revenueErr ? (
        <ErrorCard mutate={revenueMutate} />
      ) : hasRevenue && overview && overview.totalRevenue > 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <BarChartCard title="Revenue Over Time" data={revenue} />
          </div>
          <MetricCard
            label="Total Revenue"
            value={formatCents(overview.totalRevenue)}
            change={overview.changes.totalRevenue}
          />
        </div>
      ) : null}
    </div>
  );
}
