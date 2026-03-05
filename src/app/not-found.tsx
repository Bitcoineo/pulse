import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-900 font-mono">404</h1>
        <p className="mt-2 text-lg text-stone-500">Page not found</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-400 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
