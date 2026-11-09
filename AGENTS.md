# Pendragon NPC Tracker – Copilot Instructions

## Overview

Client-side React web app for tracking NPC combat state in the Pendragon tabletop RPG. No backend; all data is persisted to localStorage.

## Combat Rules (`src/utils/damage.ts`)

- Damage taken = incoming − armour − shield (shield only if used), minimum 0
- Wound: ≤0 None; < CON Minor; ≥ CON Major; ≥ maxHP Mortal
- Knockdown: incoming (before protection) > SIZ → DEX check; > 2× SIZ → automatic knockdown (position `on_ground`)
- Unconscious: currentHP < maxHP / 4, or Major/Mortal wound
- Dead: currentHP ≤ 0; otherwise status is unchanged unless unconscious
- Hit button is disabled for dead NPCs

## Templates

- Add: copy an existing JSON in `src/templates/`, edit `name` and `npc`
- Remove: delete the file
- Optional `nameGeneration: { culture, gender, title? }` (title defaults to `none`): applying the template generates the NPC name and preselects these settings in the name generator
- Loader validates every field and throws on invalid data

## Detail Generation

- "Generate Details" in the NPC form (requires API key in Settings) calls Gemini with structured JSON output; preview, then Apply sets name, description, summary
- Edit setting/naming guidance in `public/npc-details-instructions.md` (loaded at runtime)
- Output language selectable in the modal (Finnish default, persisted as `settingsStore.detailsLanguage`); instructions stay in English, language style rules live in the instructions file's "Output language" section; description headings are localised in `detailGenerator.ts`

## Names

- Add names by editing `src/data/names.json`; title/gender rules live in `TITLE_GENDERS` in `src/utils/names.ts`
- `Dialog` traps focus, restores it on close and calls `onClose` on Escape

## Coding Conventions

- Avoid inlining styles that are repeated; styles should be reusable
- Before creating convenience or utility functions, check for existing functions
- Only comment code that needs clarification

## Response Style

- Extreme brevity: direct answers, no filler or post-code summaries unless requested
- Output only changed functions/lines, using placeholders like `// ... existing code ...`
- Keep explanations to at most two bullet points, focused on non-obvious logic or edge cases
- Do not restate the request before answering
