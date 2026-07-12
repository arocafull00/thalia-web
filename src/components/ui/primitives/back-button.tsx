"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type BackButtonProps = {
  fallbackHref: string;
  label: string;
};

export function BackButton({ fallbackHref, label }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length <= 1) {
      router.replace(fallbackHref);
      return;
    }
    router.back();
  };

  return (
    <Button
      type="button"
      variant="link"
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
