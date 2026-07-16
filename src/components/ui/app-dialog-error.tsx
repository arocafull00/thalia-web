type AppDialogErrorProps = {
  message: string | undefined;
};

export default function AppDialogError({ message }: AppDialogErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      aria-live="polite"
      className="rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger"
    >
      {message}
    </p>
  );
}
