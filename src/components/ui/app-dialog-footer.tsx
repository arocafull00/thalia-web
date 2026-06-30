type AppDialogFooterProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AppDialogFooter({ children, className }: AppDialogFooterProps) {
  return (
    <div className={className ?? "mt-6 flex flex-wrap items-center justify-end gap-2"}>
      {children}
    </div>
  );
}
