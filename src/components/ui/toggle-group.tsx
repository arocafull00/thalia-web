"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const toggleGroupVariants = cva(
  "group/toggle-group flex w-fit flex-row items-center data-vertical:flex-col data-vertical:items-stretch",
  {
    variants: {
      appearance: {
        default:
          "gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)]",
        pill: "gap-0 rounded-xl border border-border bg-surface p-0.5",
      },
    },
    defaultVariants: {
      appearance: "pill",
    },
  },
);

const toggleGroupItemVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none transition-all focus:z-10 focus-visible:z-10 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      appearance: {
        default: "",
        pill: "h-8 rounded-full border-0 bg-transparent px-3 text-sm font-medium text-ink-secondary hover:bg-primary-subtle hover:text-primary data-[state=on]:bg-primary data-[state=on]:text-on-primary",
      },
    },
    defaultVariants: {
      appearance: "pill",
    },
  },
);

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> &
    VariantProps<typeof toggleGroupVariants> & {
      spacing?: number;
      orientation?: "horizontal" | "vertical";
    }
>({
  size: "default",
  variant: "default",
  appearance: "pill",
  spacing: 2,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  appearance = "pill",
  spacing,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  VariantProps<typeof toggleGroupVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  const resolvedSpacing = spacing ?? (appearance === "pill" ? 0 : 2);

  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-appearance={appearance}
      data-spacing={resolvedSpacing}
      data-orientation={orientation}
      style={{ "--gap": resolvedSpacing } as React.CSSProperties}
      className={cn(toggleGroupVariants({ appearance }), className)}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{
          variant,
          size,
          appearance,
          spacing: resolvedSpacing,
          orientation,
        }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const appearance = context.appearance ?? "pill";

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-appearance={appearance}
      data-spacing={context.spacing}
      className={cn(
        toggleGroupItemVariants({ appearance }),
        appearance === "default" &&
          "group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        appearance === "default" &&
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
