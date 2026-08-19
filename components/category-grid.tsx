"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { categoriesData } from "@/data/platform-data";

export function CategoryGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categoriesData.map((category) => {
        const isVideo = category.slug === "video";
        return (
          <motion.div
            key={category.slug}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
            className="h-full"
          >
            <Link
              href={`/categories/${category.slug}`}
              className="surface surface-hover group p-6 sm:p-7 block h-full transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl text-primary font-mono group-hover:scale-105 transition-transform">
                  {category.icon}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-mono font-medium ${
                  isVideo
                    ? "bg-accent/10 text-accent"
                    : "bg-surface-elevated text-tertiary"
                }`}>
                  {category.badge}
                </span>
              </div>

              <h3 className="mt-5 text-base sm:text-lg font-semibold text-primary group-hover:text-accent transition-colors leading-snug">
                {category.name}
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-secondary line-clamp-2 font-normal">
                {category.description}
              </p>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-border-subtle text-xs">
                <span className="text-tertiary font-mono">{category.toolCount} curated tools</span>
                <span className="text-accent font-medium group-hover:translate-x-0.5 transition-transform duration-150 inline-flex items-center gap-1">
                  Explore →
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
