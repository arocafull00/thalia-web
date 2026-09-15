import type { ReactNode } from "react";

type TermsMarkdownBlockProps = {
  block: string;
};

const INLINE_MARKDOWN_PATTERN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s]+)/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_MARKDOWN_PATTERN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${index}-${part}`} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const markdownLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (markdownLink) {
      return (
        <a
          key={`${index}-${part}`}
          href={markdownLink[2]}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {markdownLink[1]}
        </a>
      );
    }

    if (part.startsWith("http")) {
      return (
        <a
          key={`${index}-${part}`}
          href={part}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary focus-visible:rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

export default function TermsMarkdownBlock({ block }: TermsMarkdownBlockProps) {
  const lines = block.split("\n");
  const isList = lines.every((line) => line.startsWith("* "));

  if (isList) {
    return (
      <ul className="space-y-2 pl-5 marker:text-primary">
        {lines.map((line) => (
          <li key={line} className="pl-1">
            {renderInline(line.slice(2))}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p>
      {lines.map((line, index) => (
        <span key={`${index}-${line}`}>
          {index > 0 ? <br /> : null}
          {renderInline(line)}
        </span>
      ))}
    </p>
  );
}
