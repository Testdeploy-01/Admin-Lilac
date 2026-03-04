import type { ReactNode } from "react";
import { AnimateTabs, type AnimateTabsItem } from "@/components/ui/animate-tabs";

export type AppTabsItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AppTabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: AppTabsItem[];
  children?: ReactNode;
  className?: string;
};

export function AppTabs({ value, onValueChange, items, children, className }: AppTabsProps) {
  const mappedItems: AnimateTabsItem[] = items.map((item) => ({
    value: item.value,
    label: item.label,
    disabled: item.disabled,
  }));

  return (
    <AnimateTabs value={value} onValueChange={onValueChange} items={mappedItems} className={className}>
      {children}
    </AnimateTabs>
  );
}

