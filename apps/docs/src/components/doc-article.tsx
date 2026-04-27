import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx-components";
import { getAdjacentDocs, type DocPage } from "@/lib/docs";

export function DocArticle({ doc }: { doc: DocPage }) {
  const { previous, next } = getAdjacentDocs(doc.slug);

  return (
    <main className="min-w-0">
      <article className="mx-auto max-w-3xl">
        <div className="mb-10 rounded-lg border border-line bg-surface/80 p-6 shadow-soft backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{doc.section}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-text sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">{doc.description}</p>
        </div>
        <div className="space-y-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
            {doc.content}
          </ReactMarkdown>
        </div>
      </article>
      <nav className="mx-auto mt-14 grid max-w-3xl gap-3 border-t border-line pt-6 sm:grid-cols-2" aria-label="Pagination">
        {previous ? (
          <Link href={previous.slug === "index" ? "/docs" : `/docs/${previous.slug}`} className="cursor-pointer rounded-lg border border-line bg-surface p-4 transition hover:border-accent">
            <span className="flex items-center gap-2 text-sm text-faint">
              <ArrowLeft size={15} />
              Previous
            </span>
            <span className="mt-2 block font-medium text-text">{previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.slug === "index" ? "/docs" : `/docs/${next.slug}`} className="cursor-pointer rounded-lg border border-line bg-surface p-4 text-right transition hover:border-accent">
            <span className="flex items-center justify-end gap-2 text-sm text-faint">
              Next
              <ArrowRight size={15} />
            </span>
            <span className="mt-2 block font-medium text-text">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
