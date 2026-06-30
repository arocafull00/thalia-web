type AppDialogHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AppDialogHeader({ children, className }: AppDialogHeaderProps) {
  return (
    <div className={className ?? "flex flex-col gap-1 pr-8"}>
      {children}
    </div>
  );
}
