"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
  children: ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right";
  delay?: number;
};

export function Slide({ children, className, from = "up", delay = 0 }: SlideProps) {
  return (
    <div className={cn(className)} data-from={from} data-delay={delay}>
      {children}
    </div>
  );
}
