import { Boxes } from "lucide-react";

export default function InventoryItemIconDisplay() {
  return (
    <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 ring-offset-canvas">
      <Boxes className="size-9" aria-hidden="true" />
    </div>
  );
}
