import { Notice } from "@/components/ui/primitives/notice";

type AppDialogFooterProps = {
  children: React.ReactNode;
  className?: string;
  errorMessage?: string;
};

export default function AppDialogFooter({
  children,
  className,
  errorMessage,
}: AppDialogFooterProps) {
  return (
    <div
      className={
        className ?? "mt-6 flex flex-wrap items-center justify-end gap-2"
      }
    >
      {errorMessage ? (
        <div className="w-full basis-full">
          <Notice tone="danger" message={errorMessage} />
        </div>
      ) : null}
      {children}
    </div>
  );
}
