"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";

type SlidingNumberProps = {
  value: number;
  className?: string;
  formatter?: (value: number) => string;
};

export function SlidingNumber({ value, className, formatter }: SlidingNumberProps) {
  const motionValue = useMotionValue(value);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => setDisplayValue(Math.round(latest)));
    const controls = animate(motionValue, value, { duration: 0.45, ease: "easeOut" });
    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [motionValue, value]);

  return (
    <motion.span className={className}>
      {formatter ? formatter(displayValue) : displayValue.toLocaleString()}
    </motion.span>
  );
}
