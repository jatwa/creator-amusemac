/**
 * Centralized UI text & localization strings for Creator Intel.
 * Facilitates straightforward future multi-language i18n translation.
 */

export const STRINGS = {
  currency: {
    detectedNotice: "Prices shown in {currency} ({symbol}) — detected from your location",
    customNotice: "Prices shown in {currency} ({symbol}) — manually selected",
    switchCurrencyLabel: "Change Currency",
    selectCurrencyPrompt: "Select your preferred billing & display currency:",
    autoDetectLabel: "Auto-detect location",
    poweredBy: "Prices automatically adjusted for your region.",
  },
  vault: {
    heroBadge: "Director-Level Production Recipes",
    heroTitle: "The Pro Prompts Vault",
    heroSubtitle:
      "65+ rigorously tested production prompt recipes, negative constraint tokens, and optical camera blueprints designed for commercial AI directors.",
    ctaGetAccess: "Unlock Pro Vault",
    ctaSelectPlan: "Select Access Pass",
    pricingHeading: "Transparent Studio Access Plans",
    pricingSubheading: "Choose the pass that fits your production pipeline. Instant unlock across all models.",
    lifetimeGuarantee: "30-day money-back satisfaction guarantee on all passes.",
    instantAccess: "Instant Access",
    cancelAnytime: "Cancel anytime",
    commercialLicense: "Commercial Production License Included",
  },
  checkout: {
    payWithRazorpay: "Proceed to Secure Checkout",
    processing: "Initializing Checkout...",
    currencyChargedNote: "You will be charged in {currency} ({symbol}{amount})",
    securedBy: "Secured with 256-bit SSL encryption via Razorpay.",
    modalTitle: "Complete Your Vault Access",
  },
  common: {
    month: "month",
    year: "year",
    lifetime: "lifetime access",
    perMonth: "/mo",
    perYear: "/yr",
    oneTime: "one-time payment",
    save: "Save",
  },
} as const;

export type LocalizationStrings = typeof STRINGS;
