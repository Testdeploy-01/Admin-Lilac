"use client";

import { type ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type AnimateTabsItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type AnimateTabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: AnimateTabsItem[];
  children: ReactNode;
  className?: string;
};

export function AnimateTabs({ value, onValueChange, items, children, className }: AnimateTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={cn("w-full", className)}>
      <div>
        <TabsList className="h-10 rounded-xl bg-muted/70 p-1">
          {items.map((item) => (
            <TabsTrigger key={item.value} value={item.value} disabled={item.disabled} className="rounded-lg px-3">
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {children}
    </Tabs>
  );
}

export { TabsContent };

