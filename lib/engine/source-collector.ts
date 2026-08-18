import { Tool } from '@/data/types';
import { SourceRecord, IngestionSignal } from '@/lib/db/types';

export interface SourceDefinition {
  toolId: string;
  name: string;
  officialSite: string;
  pricingUrl: string;
  changelogUrl?: string;
  docsUrl?: string;
}

export const OFFICIAL_TOOL_SOURCES: SourceDefinition[] = [
  {
    toolId: 'tool-runway',
    name: 'Runway',
    officialSite: 'https://runwayml.com',
    pricingUrl: 'https://runwayml.com/pricing',
    changelogUrl: 'https://runwayml.com/changelog',
    docsUrl: 'https://docs.runwayml.com',
  },
  {
    toolId: 'tool-kling',
    name: 'Kling AI',
    officialSite: 'https://klingai.org',
    pricingUrl: 'https://klingai.org/pricing',
    changelogUrl: 'https://klingai.org/updates',
  },
  {
    toolId: 'tool-midjourney',
    name: 'Midjourney',
    officialSite: 'https://www.midjourney.com',
    pricingUrl: 'https://docs.midjourney.com/docs/plans',
    docsUrl: 'https://docs.midjourney.com',
  },
  {
    toolId: 'tool-ideogram',
    name: 'Ideogram',
    officialSite: 'https://ideogram.ai',
    pricingUrl: 'https://ideogram.ai/pricing',
  },
  {
    toolId: 'tool-descript',
    name: 'Descript',
    officialSite: 'https://www.descript.com',
    pricingUrl: 'https://www.descript.com/pricing',
  },
  {
    toolId: 'tool-elevenlabs',
    name: 'ElevenLabs',
    officialSite: 'https://elevenlabs.io',
    pricingUrl: 'https://elevenlabs.io/pricing',
    docsUrl: 'https://elevenlabs.io/docs',
  },
  {
    toolId: 'tool-topaz-video-ai',
    name: 'Topaz Video AI',
    officialSite: 'https://www.topazlabs.com/topaz-video-ai',
    pricingUrl: 'https://www.topazlabs.com/pricing',
  },
  {
    toolId: 'tool-flux',
    name: 'Flux.1 by Black Forest Labs',
    officialSite: 'https://blackforestlabs.ai',
    pricingUrl: 'https://blackforestlabs.ai/get-started',
  },
];

export async function collectSourceSignal(
  tool: Tool,
  sourceDef: SourceDefinition
): Promise<IngestionSignal[]> {
  const signals: IngestionSignal[] = [];
  const now = new Date().toISOString().split('T')[0];

  // 1. Verify Site Reachability & Response
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(sourceDef.officialSite, {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': 'CreatorIntelligenceBot/2.0 (+https://creator-amusemac.vercel.app)' },
    }).catch(() => null);
    
    clearTimeout(timeoutId);

    if (response && response.ok) {
      signals.push({
        id: `sig-${tool.id}-status-${Date.now()}`,
        sourceId: `src-${tool.slug}-site`,
        entityType: 'tool',
        entityId: tool.id,
        entityName: tool.name,
        field: 'status',
        oldValue: 'active',
        newValue: 'active',
        sourceUrl: sourceDef.officialSite,
        sourceType: 'official_site',
        confidence: 0.99,
        risk: 'low',
        status: 'applied',
        detectedAt: now,
      });
    }
  } catch {
    // Network errors are handled gracefully without throwing
  }

  return signals;
}

export async function collectAllToolSignals(tools: Tool[]): Promise<IngestionSignal[]> {
  const allSignals: IngestionSignal[] = [];

  for (const tool of tools) {
    const sourceDef = OFFICIAL_TOOL_SOURCES.find((s) => s.toolId === tool.id);
    if (sourceDef) {
      const signals = await collectSourceSignal(tool, sourceDef);
      allSignals.push(...signals);
    }
  }

  return allSignals;
}
