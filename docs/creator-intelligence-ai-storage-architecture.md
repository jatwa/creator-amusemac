# Creator Intelligence — AI, Tokens & Storage Architecture

## Plan limits

| Plan | File | Text | Pages | AI Tokens / period | Internal AI Uses / period |
| --- | ---: | ---: | ---: | ---: | ---: |
| Free | 5 MB | 15K chars | 30 | 10K | 20 |
| Basic | 25 MB | 100K chars | 150 | 100K | 100 |
| Pro | 100 MB | 500K chars | 500 | 500K | 500 |

AI Uses are an internal account-management quota. They are not shown in the primary product UI.

## Transparent action estimates

The product shows an estimated token cost before execution. Examples:

- Quick Search — ~500
- Deep Research — ~2,000
- Creative Research — ~2,500
- Film / Topic Research — ~3,000
- Story Analysis — ~5,000
- Screenplay Breakdown — ~8,000
- Scene Analysis — ~2,000
- Shot Breakdown — ~3,000
- Shot Cards — ~2,500
- Character Analysis — ~2,000
- Visual Bible — ~7,500
- Cinematography Analysis — ~3,500
- Model Recommendation — ~1,500
- Model Comparison — ~2,500
- Prompt Generation — ~1,000
- Prompt Optimization — ~750
- Scene → Video Workflow — ~5,000
- Full Story Intelligence — ~15,000
- Production Intelligence — ~12,000

Estimate is not the final charge. Successful execution records actual provider usage.

## Execution modes

### Automatic
Creator Intel chooses and executes the relevant pipeline.

### Semi-Automatic
User selects modules; Creator Intel executes the selected pipeline. This is the default workflow.

### Manual
User runs individual intelligence modules.

Skipped modules are not charged. Completed modules are persisted so a later step can resume without re-running earlier work.

## Failure policy

- Provider/API/server failure: 0 Creator Intel tokens charged.
- Invalid user input: 0 tokens charged.
- Cancelled/unexecuted step: 0 tokens charged.
- Successfully completed step: charge actual measured provider tokens.
- Partial workflows should persist completed modules and avoid reprocessing them.

## AI provider strategy

### Gemini
Use Gemini document understanding for screenplay PDFs and visually structured documents. Gemini supports native PDF understanding and can reason over text, images, diagrams, charts and tables. The Gemini Files API is appropriate for larger/reused files.

### OpenAI
Use OpenAI for structured creative reasoning, story development, directorial analysis and model/tool decision logic. Keep the provider behind a Creator Intel router so the product is not locked to one vendor.

### RAG
Creator Intel's durable knowledge graph remains its own source of truth: films, people, festivals, research, techniques, tools, prompts, workflows and project knowledge. Provider-native File Search can be used as an execution helper, not the permanent product database.

## Storage

Recommended production architecture:

1. Cloudflare R2 — original private files, processed documents, project assets and generated artifacts.
2. Neon Postgres — user/project/document metadata, AI usage, structured analysis, relationships and status.
3. Temporary provider storage — only when required for model processing.

Browser uploads should use short-lived R2 presigned PUT URLs. API credentials never reach the browser.

## Required production secrets

- GEMINI_API_KEY
- GEMINI_CREATOR_MODEL
- OPENAI_API_KEY
- OPENAI_CREATOR_MODEL
- R2_ACCOUNT_ID
- R2_BUCKET
- R2_ACCESS_KEY_ID
- R2_SECRET_ACCESS_KEY

Do not commit actual secret values.

## Current implementation boundary

The plan-aware limits, token estimates, execution modes, inner-page visual system, storage/provider architecture and environment contract are defined in the feature branch.

Live provider execution and R2 uploads should be enabled only after the corresponding provider credentials and storage bucket are configured and the integration has passed build + authenticated preview verification.