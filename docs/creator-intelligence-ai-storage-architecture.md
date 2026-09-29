# Creator Intelligence — Architecture & Intake Lifecycle

## 1. Executive Summary

Creator Intel functions as **The Intelligence Layer for Modern Filmmakers**. The creative workflow establishes a deterministic bridge from raw conceptual inputs to calibrated directorial assets:

$$\text{IDEA} \longrightarrow \text{RESEARCH} \longrightarrow \text{DIRECT} \longrightarrow \text{GENERATE} \longrightarrow \text{REFINE}$$

This document formalizes the Creative Intelligence Intake specification, plan limits, local extraction contracts, and future storage/AI integration policies.

---

## 2. Plan Tier Limits & Contracts

| Parameter | Free Discovery | Director Basic | Studio Pro |
| :--- | :--- | :--- | :--- |
| **Max File Size** | 5 MB | 25 MB | 100 MB |
| **Max Characters** | 15,000 chars | 100,000 chars | 500,000 chars |
| **Max Pages (Target)** | 30 pages | 150 pages | 500 pages |
| **Supported Ingestion**| `.txt`, `.md`, `.pdf`, `.docx` | `.txt`, `.md`, `.pdf`, `.docx` | `.txt`, `.md`, `.pdf`, `.docx` |
| **Client-Side Text Extraction** | `.txt`, `.md` (Instant) | `.txt`, `.md` (Instant) | `.txt`, `.md` (Instant) |
| **Document Text Extraction** | Queued / Pending | Queued / Pending | Queued / Pending |

---

## 3. Ingestion & Extraction Protocols

### 3.1 Local Text Extraction (`.txt`, `.md`, direct paste)
- Executed in-browser using standard HTML5 `FileReader`.
- Deterministically computes:
  - Exact Character Count (`string.length`)
  - Approximate Word Count (`text.split(/\s+/).filter(Boolean).length`)
  - Estimated Tokens (`Math.ceil(characters / 4)`)
- Validated client-side against active tier thresholds before handoff.

### 3.2 Binary Document Ingestion (`.pdf`, `.docx`)
- Staged into the session payload as raw binary references.
- **Truth-in-Extraction Policy**: Document extraction is explicitly flagged as `pending`. No synthetic text or invented page counts are displayed to users.

---

## 4. Intelligence Modules Matrix

The intake pipeline configures six canonical intelligence modules:

1. **Story & Narrative Structure (`story_analysis`)**:
   - *Purpose*: Extract core dramatic conflict, logline, three-act pacing, and thematic spine.
   - *Output Artifacts*: Logline & Premise Matrix, Three-Act Arc Breakdown, Thematic Keynotes.
2. **Character Arcs & Dynamics (`character_analysis`)**:
   - *Purpose*: Map protagonist/antagonist dynamics, internal motivations, and dialogue voice.
   - *Output Artifacts*: Dramatis Personae Dossiers, Conflict Dynamics Map, Voice & Cadence Guides.
3. **Scene-by-Scene Breakdown (`screenplay_breakdown`)**:
   - *Purpose*: Identify INT/EXT sluglines, Day/Night conditions, locations, and logistical density.
   - *Output Artifacts*: Slugline Registry, Location & Lighting Index, Scene Complexity Matrix.
4. **Cinema Precedents & Research (`film_research`)**:
   - *Purpose*: Ground the project in cinema history, reference films, genre tropes, and festival rules.
   - *Output Artifacts*: Film Reference Ledger, Visual Precedent Citations, Festival Strategy Alignment.
5. **Visual Language & Aesthetic Bible (`visual_bible`)**:
   - *Purpose*: Define lighting contrast ratios, color palettes, camera movements, and aspect ratios.
   - *Output Artifacts*: Color Space & Lighting Matrix, Optics & Lens Blueprint, Camera Rig & Movement Deck.
6. **Directorial Shot & Prompt Deck (`shot_breakdown`)**:
   - *Purpose*: Compile camera-locked scene shots and model-specific prompt recipes (Runway, Kling, Flux).
   - *Output Artifacts*: Shot-by-Shot Coverage List, Model-Tuned Prompt Slips, Artifact Suppression Negatives.

---

## 5. Execution Modes

- **Automatic (`automatic`)**: Continuous execution chaining all selected modules into a Director Project.
- **Semi-Automatic (`semi_automatic`)**: Director-in-the-loop review pausing at each phase for human calibration.
- **Manual (`manual`)**: On-demand modular inspection.

---

## 6. Downstream Integration & Handoff

The intake flow stages data into browser `sessionStorage` (`ci_staged_intake`) to bridge `/create` into `/create/analyze`. From the workspace, confirmed projects transition directly into:
- **Director's Studio** (`/prompts/factory`): For compiling visual prompt slips and camera rigs.
- **Production Toolkit** (`/toolkit`): For managing scenes, shot lists, and festival submissions.
