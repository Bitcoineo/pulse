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
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 16 8 10 12 14 16 8 20 12" />
            </svg>
          </div>
          <span className="text-xl font-bold text-stone-900">Pulse</span>
        </div>
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
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 text-center">
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

        {/* Dashboard preview */}
        <div className="mt-16 rounded-2xl border border-stone-200 bg-white p-2 shadow-xl">
          <div className="rounded-xl bg-[#FAFAF9] p-6">
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { value: "12,847", label: "Pageviews" },
                { value: "3,421", label: "Unique visitors" },
                { value: "2m 34s", label: "Avg session" },
                { value: "42.1%", label: "Bounce rate" },
              ].map((m) => (
                <div key={m.label} className="rounded-lg bg-white border border-stone-200 p-3 border-l-2 border-l-orange-500">
                  <p className="text-xl font-bold text-stone-900 font-mono">{m.value}</p>
                  <p className="text-xs text-stone-500">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="h-32 rounded-lg bg-white border border-stone-200 flex items-end px-3 pb-3 gap-1">
              {[30, 45, 35, 60, 55, 70, 65, 80, 75, 90, 85, 95, 88, 92, 78, 85, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-orange-500/30"
                  style={{ height: `${h}%` }}
                />
              ))}
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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to decode your data?</h2>
          <p className="mt-3 text-orange-100">Set up in under a minute. No credit card required.</p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-block rounded-xl bg-white px-6 py-3 text-sm font-semibold text-orange-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            Start tracking free
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-100 bg-white py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm text-stone-400">
            Built by Bitcoineo
          </p>
        </div>
      </footer>
    </div>
  );
}
