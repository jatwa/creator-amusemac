"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCurrency } from "@/context/currency-context";
import { CurrencyCode } from "@/lib/geo/types";
import { STRINGS } from "@/lib/i18n/strings";

interface CurrencySwitcherProps {
  variant?: "pill" | "banner" | "compact";
  className?: string;
}

export function CurrencySwitcher({ variant = "banner", className = "" }: CurrencySwitcherProps) {
  const {
    currency,
    currencyConfig,
    detectedCountry,
    countryName,
    isAutoDetected,
    supportedCurrencies,
    setCurrency,
    resetToAutoDetect,
    isLoading,
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const handleReset = () => {
    resetToAutoDetect();
    setIsOpen(false);
  };

  // Compact Pill Variant (for Top Nav / Header)
  if (variant === "pill" || variant === "compact") {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-mono font-medium text-secondary hover:text-primary hover:border-border-bright transition shadow-xs"
          title={`Active currency: ${currencyConfig.name}. Click to change.`}
        >
          <span>{currencyConfig.flag}</span>
          <span className="font-semibold">{currencyConfig.code}</span>
          <span className="text-tertiary">({currencyConfig.symbol.trim()})</span>
          <svg
            className={`h-3 w-3 text-tertiary transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1.5 w-60 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-tertiary border-b border-border-subtle mb-1">
              Select Currency
            </div>
            <div className="space-y-0.5">
              {supportedCurrencies.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition ${
                      isSelected
                        ? "bg-foreground text-background font-medium"
                        : "text-secondary hover:bg-surface-elevated hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{c.flag}</span>
                      <span className="font-semibold">{c.code}</span>
                      <span className="text-[11px] opacity-80 truncate max-w-[90px]">{c.name}</span>
                    </div>
                    <span className="font-mono text-[11px]">{c.symbol.trim()}</span>
                  </button>
                );
              })}
            </div>

            {!isAutoDetected && (
              <div className="mt-1.5 pt-1.5 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-mono text-accent hover:bg-accent/10 transition"
                >
                  <span>📍</span>
                  <span>{STRINGS.currency.autoDetectLabel}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Detailed Banner Variant (for Pricing Sections & Vault Page)
  const noticeText = isAutoDetected
    ? STRINGS.currency.detectedNotice
        .replace("{currency}", currencyConfig.code)
        .replace("{symbol}", currencyConfig.symbol.trim())
    : STRINGS.currency.customNotice
        .replace("{currency}", currencyConfig.code)
        .replace("{symbol}", currencyConfig.symbol.trim());

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className="inline-flex flex-wrap items-center gap-2 rounded-2xl border border-border-subtle bg-surface-elevated/60 px-3.5 py-2 text-xs text-secondary backdrop-blur-xs">
        <span className="text-sm">{currencyConfig.flag}</span>
        <span className="font-medium text-primary">
          {noticeText}
        </span>
        <span className="text-border">|</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 text-accent font-medium hover:underline cursor-pointer"
        >
          <span>{STRINGS.currency.switchCurrencyLabel}</span>
          <svg
            className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 origin-top rounded-2xl border border-border bg-surface p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1 text-[11px] font-mono text-tertiary">
            {STRINGS.currency.selectCurrencyPrompt}
          </div>

          <div className="mt-2 space-y-1">
            {supportedCurrencies.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition ${
                    isSelected
                      ? "bg-foreground text-background font-medium shadow-xs"
                      : "text-secondary hover:bg-surface-elevated hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{c.flag}</span>
                    <div className="text-left">
                      <p className="font-semibold">{c.code}</p>
                      <p className={`text-[10px] ${isSelected ? "text-background/80" : "text-tertiary"}`}>
                        {c.name}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold">{c.symbol.trim()}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-tertiary">
            <span>Location: {countryName} ({detectedCountry})</span>
            {!isAutoDetected && (
              <button
                type="button"
                onClick={handleReset}
                className="text-accent hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
