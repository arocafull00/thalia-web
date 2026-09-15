import { ChevronDown } from "lucide-react";

import type { TermsSection } from "@/copy/terms-copy";

type TermsIndexProps = {
  desktop?: boolean;
  sections: TermsSection[];
};

export default function TermsIndex({
  desktop = false,
  sections,
}: TermsIndexProps) {
  const links = sections.map((section) => (
    <li key={section.id}>
      <a
        href={`#${section.id}`}
        className="group flex gap-2 py-1.5 text-sm leading-5 text-ink-secondary transition-colors hover:text-primary focus-visible:rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="w-6 shrink-0 text-right text-xs tabular-nums text-ink-muted group-hover:text-primary">
          {section.number}.
        </span>
        <span>{section.title}</span>
      </a>
    </li>
  ));

  if (desktop) {
    return (
      <nav aria-label="Índice de los términos y condiciones">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          Índice
        </p>
        <ol className="space-y-0.5">{links}</ol>
      </nav>
    );
  }

  return (
    <details className="group mb-10 border-y border-border-subtle py-1 lg:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-semibold text-ink marker:content-none focus-visible:rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
        Índice de contenidos
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-ink-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <nav
        aria-label="Índice de los términos y condiciones"
        className="border-t border-border-subtle py-4"
      >
        <ol className="grid gap-x-6 sm:grid-cols-2">{links}</ol>
      </nav>
    </details>
  );
}
