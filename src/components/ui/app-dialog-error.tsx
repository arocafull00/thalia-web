import { Notice } from "@/components/ui/primitives/notice";

type AppDialogErrorProps = {
  message: string | undefined;
};

export default function AppDialogError({ message }: AppDialogErrorProps) {
  if (!message) {
    return null;
  }

  return <Notice tone="danger" message={message} />;
}
