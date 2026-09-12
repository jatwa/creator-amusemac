"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { BASIC_TIER_MONTHLY_LIMIT } from "@/lib/payment/razorpay-subscription";

export function UserNav({ className = "" }: { className?: string }) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (status === "loading") {
    return (
      <div className={`h-8 w-24 rounded-full bg-surface animate-pulse ${className}`} />
    );
  }

  // Unauthenticated State: Sign in with Google Button
  if (!session || !session.user) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-primary hover:border-border-bright hover:bg-surface-elevated transition shadow-xs cursor-pointer ${className}`}
        aria-label="Sign in with Google"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign In</span>
      </button>
    );
  }

  // Authenticated State: User Avatar & Menu
  const user = session.user;
  const tier = user.tier || "free";
  const initials = user.name ? user.name[0].toUpperCase() : "U";

  const tierBadgeColor =
    tier === "pro"
      ? "bg-accent/15 text-accent border-accent/30 font-semibold"
      : tier === "basic"
      ? "bg-blue-500/15 text-blue-400 border-blue-500/30 font-semibold"
      : "bg-surface-elevated text-secondary border-border font-medium";

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface p-1 pr-2.5 text-xs text-primary hover:border-border-bright transition cursor-pointer"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "User profile"}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white font-mono">
            {initials}
          </div>
        )}
        <span className="hidden sm:inline font-medium truncate max-w-[100px]">
          {user.name?.split(" ")[0] || "Account"}
        </span>
        <span className={`rounded-full border px-1.5 py-0.2 text-[9px] font-mono uppercase tracking-wider ${tierBadgeColor}`}>
          {tier}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-border bg-surface p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Header */}
          <div className="p-3 border-b border-border-subtle">
            <p className="text-xs font-semibold text-primary truncate">{user.name}</p>
            <p className="text-[11px] text-tertiary font-mono truncate">{user.email}</p>
            
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-tertiary">
                Current Plan:
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${tierBadgeColor}`}>
                {tier} Pass
              </span>
            </div>

            {tier === "basic" && (
              <div className="mt-2 text-[10px] font-mono text-secondary bg-surface-elevated p-2 rounded-lg">
                <div className="flex justify-between">
                  <span>Monthly unlocks:</span>
                  <span className="font-semibold text-primary">
                    {user.monthlyUnlocksUsed || 0}/{BASIC_TIER_MONTHLY_LIMIT}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="py-1 space-y-0.5 text-xs">
            <Link
              href="/account"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-secondary hover:bg-surface-elevated hover:text-primary transition"
            >
              <span>👤</span>
              <span>Account &amp; Subscription</span>
            </Link>

            <Link
              href="/toolkit"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-secondary hover:bg-surface-elevated hover:text-primary transition"
            >
              <span>🎬</span>
              <span>Director&apos;s Toolkit</span>
            </Link>

            <Link
              href="/prompts/vault"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-secondary hover:bg-surface-elevated hover:text-primary transition"
            >
              <span>🔒</span>
              <span>Pro Prompts Vault</span>
            </Link>

            <Link
              href="/pricing"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-accent font-medium hover:bg-accent/10 transition"
            >
              <span>✨</span>
              <span>{tier === "pro" ? "Subscription Plans" : "Upgrade to Pro"}</span>
            </Link>
          </div>

          {/* Sign out */}
          <div className="pt-1 border-t border-border-subtle">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition cursor-pointer"
            >
              <span>🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
