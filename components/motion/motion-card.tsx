"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "motion/react";

interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverY?: number;
  tapScale?: number;
}

export function MotionCard({
  children,
  className = "",
  hoverY = -3,
  tapScale = 0.99,
  ...props
}: MotionCardProps) {
  return (
    <motion.div
      whileHover={{ y: hoverY }}
      whileTap={{ scale: tapScale }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
