import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import TermsIndex from "@/components/legal/terms/terms-index";
import TermsSection from "@/components/legal/terms/terms-section";
import { LEGAL_NOTICE_COPY } from "@/copy/legal-notice-copy";
import type { TermsSection as TermsSectionData } from "@/copy/terms-copy";

const legalNoticeSections = LEGAL_NOTICE_COPY.sections as TermsSectionData[];

export default function LegalNoticePage() {
  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-border-subtle bg-surface">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary transition-colors hover:text-primary focus-visible:rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver a iniciar sesión
          </Link>
          <Link
            href="/login"
            aria-label="Ir al inicio de sesión de Thalia"
            className="flex items-center gap-2.5 rounded-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold tracking-tight text-ink">
              Thalia
            </span>
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:py-20">
        <div className="mb-10 max-w-3xl border-b border-border-subtle pb-10 sm:mb-14 sm:pb-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Información legal
          </p>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-5xl sm:leading-tight">
            {LEGAL_NOTICE_COPY.title}
          </h1>
          <p className="mt-5 text-sm text-ink-secondary">
            Última actualización: {LEGAL_NOTICE_COPY.updatedAt}
          </p>
        </div>

        <TermsIndex sections={legalNoticeSections} />

        <div className="lg:grid lg:grid-cols-[14rem_minmax(0,48rem)] lg:items-start lg:gap-14">
          <aside className="sticky top-8 hidden max-h-[calc(100vh-4rem)] overflow-y-auto pr-2 lg:block">
            <TermsIndex sections={legalNoticeSections} desktop />
          </aside>

          <article className="min-w-0 max-w-3xl">
            {legalNoticeSections.map((section) => (
              <TermsSection key={section.id} section={section} />
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
