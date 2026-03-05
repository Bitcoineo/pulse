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

export default function DashboardPage({ params }: { params: { siteId: string } }) {
  const { siteId } = params;
  const [startDate, setStartDate] = useState(subDays(new Date(), 30).toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());

  const { data: overview } = useAnalytics<OverviewData>(siteId, "overview", startDate, endDate);
  const { data: pageviews } = useAnalytics<PageviewPoint[]>(siteId, "pageviews", startDate, endDate, { granularity: "day" });
  const { data: pages } = useAnalytics<PageRow[]>(siteId, "pages", startDate, endDate);
  const { data: referrers } = useAnalytics<ReferrerRow[]>(siteId, "referrers", startDate, endDate);
  const { data: browsers } = useAnalytics<BreakdownRow[]>(siteId, "browsers", startDate, endDate);
  const { data: devices } = useAnalytics<BreakdownRow[]>(siteId, "devices", startDate, endDate);
  const { data: countries } = useAnalytics<CountryRow[]>(siteId, "countries", startDate, endDate);
  const { data: revenue } = useAnalytics<RevenuePoint[]>(siteId, "revenue", startDate, endDate);

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
        {overview ? (
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
        {pageviews ? (
          <AreaChartCard title="Pageviews Over Time" data={pageviews} />
        ) : (
          <SkeletonChart />
        )}
      </div>

      {/* ROW 3: Top Pages + Referrers */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pages ? (
          <RankingTable
            title="Top Pages"
            data={pages.map((p) => ({ label: p.path, count: p.count }))}
            labelHeader="Path"
            valueHeader="Views"
          />
        ) : (
          <SkeletonTable />
        )}
        {referrers ? (
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
        {browsers ? (
          <DonutChartCard
            title="Browsers"
            data={browsers.map((b) => ({ name: (b.browser as string) || "Unknown", count: b.count, percentage: b.percentage }))}
          />
        ) : (
          <SkeletonChart height="h-[280px]" />
        )}
        {devices ? (
          <DonutChartCard
            title="Devices"
            data={devices.map((d) => ({ name: (d.device as string) || "Unknown", count: d.count, percentage: d.percentage }))}
          />
        ) : (
          <SkeletonChart height="h-[280px]" />
        )}
        {countries ? (
          <CountryTable title="Countries" data={countries} />
        ) : (
          <SkeletonTable />
        )}
      </div>

      {/* ROW 5: Revenue (conditional) */}
      {hasRevenue && overview && overview.totalRevenue > 0 && (
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
      )}
    </div>
  );
}
