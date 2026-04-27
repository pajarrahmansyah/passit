import type { ComponentPropsWithoutRef } from "react";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";

function slugify(children: ComponentPropsWithoutRef<"h2">["children"]) {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export const mdxComponents = {
  h2: ({ className, children, ...props }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={slugify(children)} className={cn("scroll-mt-24 pt-8 text-2xl font-semibold tracking-tight text-text", className)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
    <h3 className={cn("scroll-mt-24 pt-6 text-lg font-semibold text-text", className)} {...props} />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
    <p className={cn("leading-7 text-muted", className)} {...props} />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
    <a className={cn("cursor-pointer font-medium text-accent underline-offset-4 hover:underline", className)} {...props} />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <ul className={cn("my-5 ml-5 list-disc space-y-2 text-muted", className)} {...props} />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
    <ol className={cn("my-5 ml-5 list-decimal space-y-2 text-muted", className)} {...props} />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
    <li className={cn("pl-1 leading-7", className)} {...props} />
  ),
  code: ({ className, children, ...props }: ComponentPropsWithoutRef<"code">) => {
    const match = /language-(\w+)/.exec(className ?? "");

    if (match) {
      return <CodeBlock code={String(children).replace(/\n$/, "")} language={match[1]} />;
    }

    return (
      <code className={cn("rounded border border-line bg-code px-1.5 py-0.5 font-mono text-[0.88em] text-codeText", className)} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }: ComponentPropsWithoutRef<"pre">) => <>{children}</>,
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className={cn("my-6 border-l-2 border-accent pl-5 text-muted", className)} {...props} />
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-line bg-bg/40">
      <table className={cn("w-full min-w-[900px] border-collapse text-left text-sm", className)} {...props} />
    </div>
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
    <tr className={cn("border-b border-line last:border-b-0", className)} {...props} />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
    <th className={cn("bg-surface px-5 py-3.5 font-semibold text-text", className)} {...props} />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
    <td className={cn("whitespace-nowrap px-5 py-4 align-top leading-7 text-muted last:whitespace-normal", className)} {...props} />
  ),
};
