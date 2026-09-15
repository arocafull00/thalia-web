import TermsMarkdownBlock from "@/components/legal/terms/terms-markdown-block";

type TermsMarkdownProps = {
  body: string;
};

export default function TermsMarkdown({ body }: TermsMarkdownProps) {
  const blocks = body.split(/\n{2,}/);

  return (
    <div className="space-y-5 text-[0.9375rem] leading-7 text-ink-secondary sm:text-base sm:leading-8">
      {blocks.map((block, index) => (
        <TermsMarkdownBlock
          key={`${index}-${block.slice(0, 24)}`}
          block={block}
        />
      ))}
    </div>
  );
}
