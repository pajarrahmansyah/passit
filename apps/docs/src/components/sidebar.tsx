"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DocPage } from "@/lib/docs";
import { cn } from "@/lib/utils";

export function Sidebar({ sections }: { sections: [string, DocPage[]][] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-8 text-sm" aria-label="Documentation">
      {sections.map(([section, docs]) => (
        <div key={section}>
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">{section}</p>
          <div className="space-y-1">
            {docs.map((doc) => {
              const href = doc.slug === "index" ? "/docs" : `/docs/${doc.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={doc.slug}
                  href={href}
                  className={cn(
                    "block cursor-pointer rounded-md border border-transparent px-3 py-2 text-muted transition hover:border-line hover:bg-surface hover:text-text",
                    active && "border-line bg-accentSoft text-text shadow-soft",
                  )}
                >
                  {doc.title}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
