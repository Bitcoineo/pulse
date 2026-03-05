import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/sites");

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Nav */}
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 16 8 10 12 14 16 8 20 12" />
            </svg>
          </div>
          <span className="text-xl font-bold text-stone-900">Pulse</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/signin"
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-5xl px-6 pb-10 pt-12 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600">
          <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
          Signal over noise
        </div>
        <h1 className="mx-auto max-w-3xl text-5xl font-extrabold tracking-tight text-stone-900 sm:text-6xl">
          Your data, decoded.{" "}
          <span className="text-orange-500">Every signal, surfaced.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-stone-500 leading-relaxed">
          Pulse cuts through vanity metrics to show you what actually moves the needle.
          Pageviews, funnels, revenue — no fluff, no guesswork.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
          >
            Start tracking free
          </Link>
          <Link
            href="/auth/signin"
            className="rounded-xl border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-white hover:border-stone-400 transition-colors"
          >
            View demo
          </Link>
        </div>

        {/* Dashboard preview — animated */}
        <div className="mt-16 mock-container rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
          <div className="rounded-xl bg-[#FAFAF9] p-6">
            {/* Metric cards with stagger + count-up */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              <div className="mock-card rounded-lg bg-white border border-stone-200 p-3 border-l-2 border-l-orange-500">
                <p className="text-xl font-bold text-stone-900 font-mono mock-num-pv" />
                <p className="text-xs text-stone-500">Pageviews</p>
              </div>
              <div className="mock-card rounded-lg bg-white border border-stone-200 p-3 border-l-2 border-l-orange-500">
                <p className="text-xl font-bold text-stone-900 font-mono mock-num-vis" />
                <p className="text-xs text-stone-500">Unique visitors</p>
              </div>
              <div className="mock-card rounded-lg bg-white border border-stone-200 p-3 border-l-2 border-l-orange-500">
                <p className="text-xl font-bold text-stone-900 font-mono">2m 34s</p>
                <p className="text-xs text-stone-500">Avg session</p>
              </div>
              <div className="mock-card rounded-lg bg-white border border-stone-200 p-3 border-l-2 border-l-orange-500">
                <p className="text-xl font-bold text-stone-900 font-mono">42.1%</p>
                <p className="text-xs text-stone-500">Bounce rate</p>
              </div>
            </div>

            {/* Area chart — line draws, then fill fades in + pulses */}
            <div className="h-32 rounded-lg bg-white border border-stone-200 overflow-hidden">
              <svg viewBox="0 0 500 128" className="w-full h-full" preserveAspectRatio="none">
                <path
                  className="mock-chart-fill"
                  d="M10,92 L40,74 L70,86 L100,56 L130,62 L160,44 L190,50 L220,32 L250,38 L280,20 L310,26 L340,14 L370,22 L400,18 L430,34 L460,26 L490,44 L490,128 L10,128 Z"
                  fill="#F97316"
                />
                <polyline
                  className="mock-chart-line"
                  points="10,92 40,74 70,86 100,56 130,62 160,44 190,50 220,32 250,38 280,20 310,26 340,14 370,22 400,18 430,34 460,26 490,44"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                />
              </svg>
            </div>

            {/* Mini table — rows slide in from left */}
            <div className="mt-3 rounded-lg bg-white border border-stone-200 overflow-hidden">
              <div className="px-3 py-1.5 border-b border-stone-100 flex text-[10px] font-medium text-stone-400 uppercase">
                <span className="flex-1">Top pages</span>
                <span>Views</span>
              </div>
              <div>
                {[
                  { path: "/home", views: "4,281" },
                  { path: "/pricing", views: "2,847" },
                  { path: "/blog", views: "1,923" },
                  { path: "/docs", views: "1,456" },
                ].map((row) => (
                  <div key={row.path} className="mock-row flex px-3 py-1.5 text-xs border-b border-stone-50 last:border-0">
                    <span className="flex-1 text-stone-700 font-mono">{row.path}</span>
                    <span className="text-stone-900 font-mono font-medium">{row.views}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Metrics that matter",
                desc: "Pageviews, visitors, session duration, bounce rate. Everything auto-updates every 60 seconds.",
                icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Every event, tracked",
                desc: "Clicks, signups, purchases — track anything. Filter, sort, and drill down to the row level.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                title: "Your data, portable",
                desc: "Import via CSV, export anytime. No lock-in, no walled gardens. Your analytics belong to you.",
                icon: "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                  <svg className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to decode your data?</h2>
          <p className="mt-3 text-orange-100">Set up in under a minute. No credit card required.</p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start tracking free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-center gap-4">
            <p className="text-sm text-stone-400">Built by Bitcoineo</p>
            <a href="https://github.com/Bitcoineo" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-orange-500 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://x.com/Bitcoineo" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-orange-500 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
