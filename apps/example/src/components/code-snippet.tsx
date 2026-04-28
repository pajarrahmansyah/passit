type CodeSnippetProps = {
  code: string;
};

const tokenPattern =
  /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:export|default|return|import|from|async|function|const|let|type)\b|\b(?:true|false|null|undefined)\b|\b\d+\b)/g;

function tokenClassName(token: string) {
  if (/^["'`]/.test(token)) return "text-[var(--code-string)]";
  if (/^\d+$/.test(token)) return "text-[var(--code-number)]";
  if (/^(true|false|null|undefined)$/.test(token)) return "text-[var(--code-boolean)]";
  return "text-[var(--code-keyword)]";
}

function highlightLine(line: string) {
  const parts = line.split(tokenPattern).filter(Boolean);

  return parts.map((part, index) =>
    tokenPattern.test(part) ? (
      <span key={`${part}-${index}`} className={tokenClassName(part)}>
        {part}
      </span>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

export function CodeSnippet({ code }: CodeSnippetProps) {
  const lines = code.split("\n");

  return (
    <pre className="code-surface console-scroll block w-full max-w-full overflow-x-auto overflow-y-hidden p-5 text-sm leading-6">
      <code className="block min-w-max">
        {lines.map((line, index) => (
          <span key={`${index}-${line}`} className="block min-w-max">
            <span className="mr-5 inline-block w-5 select-none text-right text-[var(--code-line)]">
              {index + 1}
            </span>
            {highlightLine(line)}
          </span>
        ))}
      </code>
    </pre>
  );
}
