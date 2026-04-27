import Link from "next/link";
import { Menu, Terminal } from "lucide-react";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDocsBySection } from "@/lib/docs";

export function DocsShell({ children }: { children: ReactNode }) {
  const sections = getDocsBySection();

  return (
    <div className="min-h-screen">
      <div className="docs-grid pointer-events-none fixed inset-x-0 top-0 h-[520px] opacity-30" />
      <header className="sticky top-0 z-40 border-b border-line bg-bg/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/docs" className="flex cursor-pointer items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-accent text-bg shadow-soft">
              <Terminal size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-none text-text">PassIt</span>
              <span className="mt-1 block font-mono text-[11px] leading-none text-faint">@pajarrahmansyah/passit</span>
            </span>
          </Link>
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <a href="http://passit-example.pajar.my.id/" className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-text">
              demo
            </a>
            <span className="text-line" aria-hidden>
              |
            </span>
            <a href="https://github.com/pajarrahmansyah/passit" className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-text">
              github
            </a>
            <span className="text-line" aria-hidden>
              |
            </span>
            <ThemeToggle />
          </div>
          <div className="ml-auto flex items-center gap-3 md:hidden">
            <a href="http://passit-example.pajar.my.id/" className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-text">
              demo
            </a>
            <span className="text-line" aria-hidden>
              |
            </span>
            <a href="https://github.com/pajarrahmansyah/passit" className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition hover:text-text">
              github
            </a>
            <span className="text-line" aria-hidden>
              |
            </span>
            <ThemeToggle />
            <details className="relative">
              <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-line bg-surface text-muted">
                <Menu size={16} />
              </summary>
              <div className="absolute right-0 top-12 max-h-[70vh] w-72 overflow-y-auto rounded-lg border border-line bg-bg p-4 shadow-soft">
                <Sidebar sections={sections} />
              </div>
            </details>
          </div>
        </div>
      </header>
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] overflow-y-auto pr-3 lg:block">
          <Sidebar sections={sections} />
        </aside>
        {children}
      </div>
    </div>
  );
}
