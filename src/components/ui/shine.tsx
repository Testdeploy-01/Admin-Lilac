"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ShineProps = {
  className?: string;
};

export function Shine({ className }: ShineProps) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent",
        className,
      )}
      animate={{ x: ["-10%", "330%"] }}
      transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.8 }}
    />
  );
}

