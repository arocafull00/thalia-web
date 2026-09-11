import Link from "next/link";

import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";
import type { RecoveryLinkError } from "@/lib/hooks/use-reset-password";

type ResetPasswordLinkErrorProps = {
  error: RecoveryLinkError;
};

export default function ResetPasswordLinkError({
  error,
}: ResetPasswordLinkErrorProps) {
  return (
    <div className="space-y-4">
      <Notice tone="danger" message={LOGIN_COPY.resetPassword.errors[error]} />
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline hover:text-primary-light"
        >
          {LOGIN_COPY.resetPassword.requestNewLink}
        </Link>
      </div>
    </div>
  );
}
