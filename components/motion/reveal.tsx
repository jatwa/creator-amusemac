"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

export type RevealVariant = "fade-up" | "fade-in" | "subtle-scale" | "section-reveal";

interface RevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  inView?: boolean;
  className?: string;
}

export function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.4,
  inView = true,
  className = "",
  ...props
}: RevealProps) {
  const transition = {
    duration,
    delay,
    ease: [0.16, 1, 0.3, 1] as const,
  };

  const initialProps =
    variant === "fade-in"
      ? { opacity: 0 }
      : variant === "subtle-scale"
      ? { opacity: 0, scale: 0.98 }
      : { opacity: 0, y: 12 };

  const targetProps =
    variant === "subtle-scale"
      ? { opacity: 1, scale: 1 }
      : { opacity: 1, y: 0 };

  if (inView) {
    return (
      <motion.div
        initial={initialProps}
        whileInView={targetProps}
        viewport={{ once: true, amount: 0.05 }}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initialProps}
      animate={targetProps}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
