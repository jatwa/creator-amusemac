"use client";

import React, { useEffect } from "react";

interface AdSlotProps {
  slotId?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  responsive?: boolean;
  className?: string;
  label?: string;
}

export function AdSlot({
  slotId = "default-slot",
  format = "auto",
  responsive = true,
  className = "",
  label = "Sponsor / Ad Space",
}: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (adsenseClient && typeof window !== "undefined") {
      try {
        // @ts-expect-error Google Ads script global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [adsenseClient]);

  // If AdSense client ID is configured, render official Google AdSense tag
  if (adsenseClient) {
    return (
      <div className={`my-8 flex flex-col items-center justify-center ${className}`}>
        <span className="text-[9px] font-mono uppercase tracking-widest text-tertiary mb-1">
          {label}
        </span>
        <ins
          className="adsbygoogle block overflow-hidden rounded-xl border border-border-subtle bg-surface/40 text-center"
          style={{ display: "block" }}
          data-ad-client={adsenseClient}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    );
  }

  // If no AdSense client is set, render clean, non-intrusive editorial container placeholder
  return (
    <div
      className={`my-8 rounded-2xl border border-dashed border-border-subtle bg-surface/20 p-4 text-center ${className}`}
      aria-label="Advertisement Space"
    >
      <div className="flex flex-col items-center justify-center space-y-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary">
          {label}
        </span>
        <p className="text-xs text-secondary font-medium">
          Creator by Amusemac Editorial Intelligence — Google AdSense Ready
        </p>
      </div>
    </div>
  );
}
