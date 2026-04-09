import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-red-600">404</div>
      <h1 className="text-3xl font-bold text-[#222]">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm text-[#666]">
        The page you requested does not exist in this Picnic demo.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-[#d40c2f] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(212,12,47,0.2)]"
      >
        Back to home
      </Link>
    </main>
  );
}
