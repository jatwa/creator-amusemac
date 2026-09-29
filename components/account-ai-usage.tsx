"use client";

import { useEffect, useState } from "react";

export function AccountAiUsage() {
  const [usage, setUsage] = useState<any>(null);

  useEffect(() => {
    fetch("/api/creator-intelligence/usage")
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setUsage(data?.usage || null))
      .catch(() => undefined);
  }, []);

  if (!usage) return null;

  return (
    <section className="shell mt-10">
      <div className="intel-card p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="intel-eyebrow">AI Usage</span>
            <h2 className="mt-2 text-xl font-bold text-primary">Creator Intelligence allowance</h2>
            <p className="mt-1 text-xs text-secondary">Private account telemetry for the current billing period.</p>
          </div>
          <span className="intel-mono">ACCOUNT ONLY</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="intel-card-muted p-5">
            <span className="meta-label">AI Tokens</span>
            <p className="mt-3 text-2xl font-bold text-primary">{usage.tokensRemaining.toLocaleString()}</p>
            <p className="mt-1 intel-mono">of {usage.tokenLimit.toLocaleString()} remaining</p>
          </div>
          <div className="intel-card-muted p-5">
            <span className="meta-label">AI Uses</span>
            <p className="mt-3 text-2xl font-bold text-primary">{usage.usesRemaining}</p>
            <p className="mt-1 intel-mono">of {usage.useLimit} remaining</p>
          </div>
        </div>
      </div>
    </section>
  );
}
