"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const BEAMS = [
  { id: 1, d: "M-120 20 C 160 120 360 40 760 160", delay: 0, duration: 14 },
  { id: 2, d: "M-180 120 C 200 230 420 120 820 250", delay: 1.8, duration: 16 },
  { id: 3, d: "M-200 250 C 200 340 500 240 900 360", delay: 3.2, duration: 18 },
];

export function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg className="h-full w-full" viewBox="0 0 900 400" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            <stop offset="45%" stopColor="hsl(var(--primary))" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {BEAMS.map((beam) => (
          <motion.path
            key={beam.id}
            d={beam.d}
            stroke="url(#beam-gradient)"
            strokeWidth="1.2"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1], opacity: [0, 0.8, 0] }}
            transition={{ repeat: Infinity, ease: "easeInOut", duration: beam.duration, delay: beam.delay }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
    </div>
  );
}

