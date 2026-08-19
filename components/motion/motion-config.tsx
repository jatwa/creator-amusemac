"use client";

import React from "react";
import { MotionConfig as MotionConfigProvider } from "motion/react";

/**
 * Global Motion Configuration for Creator by Amusemac
 * - Enforces standard Apple-inspired timing curves (cubic-bezier(0.16, 1, 0.3, 1))
 * - Automatically respects user prefers-reduced-motion
 */
export function MotionConfig({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfigProvider
      reducedMotion="user"
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
    >
      {children}
    </MotionConfigProvider>
  );
}
