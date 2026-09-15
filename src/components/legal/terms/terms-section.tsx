import TermsMarkdown from "@/components/legal/terms/terms-markdown";
import type { TermsSection as TermsSectionData } from "@/copy/terms-copy";

type TermsSectionProps = {
  section: TermsSectionData;
};

export default function TermsSection({ section }: TermsSectionProps) {
  return (
    <section
      id={section.id}
      className="scroll-mt-8 border-t border-border-subtle py-10 first:border-t-0 first:pt-0 sm:py-12"
    >
      <div className="mb-6 flex items-baseline gap-4">
        <span className="text-sm font-semibold tabular-nums text-primary">
          {String(section.number).padStart(2, "0")}
        </span>
        <h2 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {section.title}
        </h2>
      </div>
      <TermsMarkdown body={section.body} />
    </section>
  );
}
