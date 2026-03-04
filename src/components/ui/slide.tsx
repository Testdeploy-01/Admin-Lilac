"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SlideProps = {
  children: ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right";
  delay?: number;
};

export function Slide({ children, className, from = "up", delay = 0 }: SlideProps) {
  const variants = {
    up: { y: 12, x: 0 },
    down: { y: -12, x: 0 },
    left: { y: 0, x: 12 },
    right: { y: 0, x: -12 },
  }[from];

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...variants }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.24, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

