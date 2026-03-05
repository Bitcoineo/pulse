import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

function buildUrl(base: string, params: Record<string, string>) {
  const search = new URLSearchParams(params).toString();
  return `${base}?${search}`;
}

export function useAnalytics<T>(
  siteId: string,
  endpoint: string,
  startDate: string,
  endDate: string,
  extraParams?: Record<string, string>
) {
  const url = buildUrl(`/api/sites/${siteId}/analytics/${endpoint}`, {
    start: startDate,
    end: endDate,
    ...extraParams,
  });

  return useSWR<T>(url, fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
}

export function useSites() {
  return useSWR("/api/sites", fetcher);
}
