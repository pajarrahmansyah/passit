import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-text">This route missed the gateway.</h1>
        <p className="mt-4 text-muted">The documentation page you requested does not exist.</p>
        <Link href="/docs" className="mt-8 inline-flex cursor-pointer rounded-md bg-accent px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accentStrong">
          Back to docs
        </Link>
      </div>
    </main>
  );
}
