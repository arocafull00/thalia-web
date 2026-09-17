import Link from "next/link";

import { LOGIN_COPY } from "@/copy/login-copy";

export default function LoginFooter() {
  return (
    <footer className="flex flex-col gap-3 border-t border-border-subtle px-6 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <span>{LOGIN_COPY.footer.copyright}</span>
      <Link href="/terms" className="text-primary hover:text-primary-hover">
        {LOGIN_COPY.footer.terms}
      </Link>
    </footer>
  );
}
