"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Play, TerminalSquare } from "lucide-react";

type DemoRoute = [label: string, path: string];

type DemoConsoleProps = {
  routes: DemoRoute[];
};

type ResultState = {
  status: number;
  ok: boolean;
  body: unknown;
  elapsed: number;
};

export function DemoConsole({ routes }: DemoConsoleProps) {
  const [selectedPath, setSelectedPath] = useState(routes[0]?.[1] ?? "");
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedLabel = useMemo(
    () => routes.find((route) => route[1] === selectedPath)?.[0] ?? "Custom route",
    [routes, selectedPath],
  );

  function runDemo(path = selectedPath) {
    setSelectedPath(path);
    setError(null);
    setResult(null);

    startTransition(async () => {
      const started = performance.now();

      try {
        const response = await fetch(path, {
          headers: {
            "x-client-demo": "browser-request",
          },
        });
        const contentType = response.headers.get("content-type") ?? "";
        const body = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        setResult({
          status: response.status,
          ok: response.ok,
          body,
          elapsed: Math.round(performance.now() - started),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
      }
    });
  }

  return (
    <section className="w-full min-w-0 border border-foreground bg-[var(--panel)] shadow-[8px_8px_0_var(--foreground)] sm:shadow-[10px_10px_0_var(--foreground)]">
      <div className="flex items-center justify-between border-b border-foreground px-5 py-4">
        <div className="min-w-0 flex items-center gap-3">
          <TerminalSquare className="size-5 text-[var(--rust)]" aria-hidden />
          <div className="min-w-0">
            <h2 className="font-semibold">Live Route Runner</h2>
            <p className="truncate text-sm text-[var(--muted)]">{selectedLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => runDemo()}
          className="inline-flex h-10 items-center gap-2 border border-[var(--line)] bg-[var(--panel)] px-4 text-sm font-bold text-foreground transition hover:border-[var(--acid)] hover:text-[var(--acid)] disabled:cursor-wait disabled:opacity-70"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />}
          Run
        </button>
      </div>

      <div className="grid min-w-0 gap-0 lg:grid-cols-[minmax(10rem,0.34fr)_minmax(0,0.66fr)]">
        <div className="min-w-0 border-b border-foreground lg:border-b-0 lg:border-r">
          {routes.map(([label, path]) => (
            <button
              key={path}
              type="button"
              onClick={() => runDemo(path)}
              className={`flex w-full items-start justify-between gap-4 border-b border-[var(--line)] px-4 py-3 text-left transition last:border-b-0 hover:bg-[var(--acid)]/30 ${
                selectedPath === path ? "bg-[var(--acid)]/50" : ""
              }`}
            >
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="mt-1 block break-all font-mono text-xs text-[var(--muted)]">
                  {path}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex min-h-[34rem] min-w-0 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-foreground px-5 py-4">
            {error ? (
              <AlertTriangle className="size-5 text-[var(--rust)]" aria-hidden />
            ) : result?.ok ? (
              <CheckCircle2 className="size-5 text-[var(--teal)]" aria-hidden />
            ) : (
              <TerminalSquare className="size-5 text-[var(--muted)]" aria-hidden />
            )}
            <div className="min-w-0">
              <p className="truncate font-mono text-sm">{selectedPath}</p>
              <p className="text-xs text-[var(--muted)]">
                {result ? `HTTP ${result.status} in ${result.elapsed}ms` : "Ready to send"}
              </p>
            </div>
          </div>
          <pre className="console-scroll min-h-0 max-w-full flex-1 overflow-auto bg-[#11120f] p-5 text-xs leading-5 text-[#f6f3ea]">
            <code>
              {error
                ? error
                : result
                  ? JSON.stringify(result.body, null, 2)
                  : "Select a PassIt route and run it to inspect the normalized response."}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
