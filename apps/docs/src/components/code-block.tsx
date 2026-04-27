"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language = "text" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="code-window group my-6 overflow-hidden rounded-lg border border-line bg-code shadow-soft">
      <div className="flex h-10 items-center justify-between border-b border-line px-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffd166]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#66d27a]" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{language}</span>
          <button
            type="button"
            className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-md border border-line bg-surface px-2 font-mono text-[11px] text-muted transition hover:border-accent hover:text-text"
            onClick={copyCode}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        PreTag="div"
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1.25rem",
        }}
        codeTagProps={{
          className: "font-mono text-[0.92rem] leading-7",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
