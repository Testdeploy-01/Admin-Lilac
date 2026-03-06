"use client";

import { cn } from "@/lib/utils";

type TextGenerateEffectProps = {
  words: string;
  className?: string;
};

export function TextGenerateEffect({ words, className }: TextGenerateEffectProps) {
  return (
    <div className={cn("font-bold", className)}>
      <div className="text-2xl leading-snug tracking-wide text-foreground">{words}</div>
    </div>
  );
}

