"use client";

import React, { useEffect, useState } from "react";

interface TocItem {
  id: string;
  label: string;
}

interface StickyTocProps {
  items: TocItem[];
  className?: string;
}

export function StickyToc({ items, className = "" }: StickyTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className={`space-y-3 ${className}`} aria-label="On this page navigation">
      <p className="text-[11px] font-mono uppercase tracking-widest text-tertiary">
        On This Page
      </p>

      <ul className="space-y-1 text-xs border-l border-border-subtle pl-3">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => scrollTo(item.id)}
                className={`text-left block py-1 transition-colors ${
                  isActive
                    ? "text-accent font-medium -ml-[13px] border-l-2 border-accent pl-2.5"
                    : "text-secondary hover:text-primary"
                }`}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
