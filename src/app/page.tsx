import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/sites");

  return (
    <div className="min-h-screen">
      {/* Dark hero */}
      <div className="bg-gray-950">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Pulse</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-1.5 text-sm font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Simple analytics, zero noise
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
            Know what&apos;s happening.{" "}
            <span className="text-emerald-400">Act on what matters.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-gray-400 leading-relaxed">
            Track pageviews, events, and revenue. See where users come from and what they do.
            Import data via CSV, export reports, and build custom dashboards.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
            >
              Start tracking
            </Link>
            <Link
              href="/auth/signin"
              className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
            >
              Sign in
            </Link>
          </div>

          {/* Dashboard preview */}
          <div className="mt-16 rounded-2xl border border-gray-800 bg-gray-900 p-2 shadow-2xl">
            <div className="rounded-xl bg-gray-950 p-6">
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { value: "12,847", label: "Pageviews" },
                  { value: "3,421", label: "Visitors" },
                  { value: "2m 34s", label: "Avg Duration" },
                  { value: "42.1%", label: "Bounce Rate" },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg bg-gray-900 border border-gray-800 p-3">
                    <p className="text-xl font-bold text-white">{m.value}</p>
                    <p className="text-xs text-gray-500">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="h-32 rounded-lg bg-gray-900 border border-gray-800 flex items-end px-3 pb-3 gap-1">
                {[30, 45, 35, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 92, 78, 85, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-emerald-500/40"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Real-time metrics",
                desc: "See pageviews, visitors, bounce rate, and session duration update as traffic comes in.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Custom events",
                desc: "Track clicks, signups, purchases, and any custom event. Filter and aggregate however you want.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                title: "Export anything",
                desc: "Download filtered events as CSV. Import your existing data. Your analytics, your data.",
                icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm text-gray-400">
            Built by Bitcoineo
          </p>
        </div>
      </footer>
    </div>
  );
}
