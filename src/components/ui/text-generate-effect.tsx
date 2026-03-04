"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type TextGenerateEffectProps = {
  words: string;
  className?: string;
};

export function TextGenerateEffect({ words, className }: TextGenerateEffectProps) {
  const wordList = words.split(" ").filter(Boolean);

  return (
    <div className={cn("font-bold", className)}>
      <div className="text-2xl leading-snug tracking-wide text-foreground">
        {wordList.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="mr-1 inline-block"
            initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.24, delay: index * 0.06 }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

