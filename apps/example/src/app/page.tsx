import { DemoConsole } from "@/components/demo-console";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BadgeCheck,
  Braces,
  Cable,
  FileJson,
  Gauge,
  GitBranch,
  KeyRound,
  Radar,
  Route,
  ShieldCheck,
  TimerReset,
} from "lucide-react";

const features = [
  {
    icon: Cable,
    title: "Route Handler Proxy",
    copy: "Forward client requests through App Router endpoints while the backend URL stays server-side.",
  },
  {
    icon: GitBranch,
    title: "Multi Service Config",
    copy: "Switch between JSONPlaceholder, httpbin, and an axios-backed service by key.",
  },
  {
    icon: KeyRound,
    title: "Header Injection",
    copy: "Add static config headers and route-level headers without exposing API keys.",
  },
  {
    icon: TimerReset,
    title: "Timeout + Retry",
    copy: "Set global defaults and override retry behavior per route for server errors.",
  },
  {
    icon: FileJson,
    title: "Normalization",
    copy: "Wrap success and error responses into a consistent shape for frontend consumers.",
  },
  {
    icon: Braces,
    title: "Response Transform",
    copy: "Map backend payloads into the exact contract your app wants to render.",
  },
  {
    icon: Radar,
    title: "Hooks",
    copy: "Use request, response, and error hooks for development logs or production observability.",
  },
  {
    icon: Gauge,
    title: "Fetch + Axios",
    copy: "Exercise the default fetch adapter and the optional axios adapter in one demo app.",
  },
];

const routes: [string, string][] = [
  ["Basic proxy", "/api/basic?_limit=3"],
  ["Dynamic path", "/api/post/7"],
  ["Normalized response", "/api/normalized"],
  ["Response transform", "/api/transform?_limit=8"],
  ["Header merge", "/api/headers"],
  ["HTML/text handling", "/api/text"],
  ["Retry + timeout", "/api/retry-timeout"],
  ["Axios adapter", "/api/axios"],
];

const configSnippet = `export default defineConfig({
  json: {
    baseUrl: "https://jsonplaceholder.typicode.com",
    http: "fetch",
    headers: { "x-passit-app": "nextjs-15-example" },
    timeout: 5000,
    normalize: { success: true, error: true },
  },
  axiosJson: {
    baseUrl: "https://jsonplaceholder.typicode.com",
    http: "axios",
    normalize: true,
  },
})`;

const routeSnippet = `export async function GET(req: NextRequest) {
  return passIt({
    service: "json",
    path: "/posts",
    req,
    normalize: false,
    response: (posts) => ({
      count: posts.length,
      preview: posts.slice(0, 5),
    }),
  })
}`;

const docsUrl =
  process.env.NEXT_PUBLIC_PASSIT_DOCS_URL ??
  "https://passit.pajar.my.id";

export default function Home() {
  return (
    <main className="grain min-h-screen overflow-hidden">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <nav className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center border border-foreground bg-[var(--acid)]">
              <Route className="size-5" aria-hidden />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                Next.js 15 App Router
              </p>
              <p className="font-semibold">PassIt Demo Example</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-foreground"
              href={docsUrl}
              target="_blank"
              rel="noreferrer"
            >
              docs
            </a>
            <span className="text-[var(--line)]" aria-hidden>
              |
            </span>
            <a
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-foreground"
              href="https://github.com/pajarrahmansyah/passit"
              target="_blank"
              rel="noreferrer"
            >
              github
            </a>
            <span className="text-[var(--line)]" aria-hidden>
              |
            </span>
            <ThemeToggle />
          </div>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-start">
          <div className="self-start space-y-7 py-6">
            <div className="inline-flex items-center gap-2 border border-foreground bg-[var(--panel)] px-3 py-2 font-mono text-xs uppercase tracking-[0.18em]">
              <ShieldCheck className="size-4 text-[var(--teal)]" aria-hidden />
              Server-side gateway demo
            </div>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-normal text-foreground sm:text-7xl lg:text-8xl">
                Stop rewriting proxy boilerplate.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
                A runnable Next.js 15 project that implements every published
                `@pajarrahmansyah/passit` feature through App Router route handlers.
              </p>
            </div>
            <div className="grid max-w-2xl grid-cols-3 border border-foreground bg-[var(--panel)]">
              {[
                ["8", "demo routes"],
                ["3", "services"],
                ["2", "adapters"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-foreground p-4 last:border-r-0">
                  <p className="font-mono text-3xl font-bold">{value}</p>
                  <p className="text-sm text-[var(--muted)]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <DemoConsole routes={routes} />
        </div>
      </section>

      <section className="border-y border-foreground bg-[var(--ink)] text-[#f6f3ea]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="min-h-48 border-b border-r border-background/20 p-6 md:border-b-0"
            >
              <feature.icon className="mb-8 size-6 text-[var(--acid)]" aria-hidden />
              <h2 className="mb-3 text-lg font-semibold">{feature.title}</h2>
              <p className="text-sm leading-6 text-[#c8c2b4]">{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="border border-foreground bg-[var(--panel)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="size-5 text-[var(--teal)]" aria-hidden />
            <h2 className="text-xl font-bold">Config in `passit.config.ts`</h2>
          </div>
          <pre className="overflow-x-auto bg-foreground p-5 text-sm leading-6 text-background">
            <code>{configSnippet}</code>
          </pre>
        </div>
        <div className="border border-foreground bg-[var(--panel)] p-5">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="size-5 text-[var(--rust)]" aria-hidden />
            <h2 className="text-xl font-bold">Route handler usage</h2>
          </div>
          <pre className="overflow-x-auto bg-foreground p-5 text-sm leading-6 text-background">
            <code>{routeSnippet}</code>
          </pre>
        </div>
      </section>
    </main>
  );
}
