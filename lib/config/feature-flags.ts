/**
 * Central Feature Flag Registry for Creator Intel
 */
export interface FeatureFlags {
  enableDecisionFinder: boolean;
  enableMediaHub: boolean;
  enableVaultPromptGating: boolean;
  enableAdminSimulator: boolean;
  enableAuthorPages: boolean;
  enableMethodologyPage: boolean;
  enablePressPage: boolean;
  enableEmailCapture: boolean;
}

export const FEATURE_FLAGS: FeatureFlags = {
  enableDecisionFinder: true,
  enableMediaHub: true,
  enableVaultPromptGating: true,
  enableAdminSimulator: true,
  enableAuthorPages: true,
  enableMethodologyPage: true,
  enablePressPage: true,
  enableEmailCapture: true,
};

export function getFeatureFlag(flag: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[flag] ?? true;
}
