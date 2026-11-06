# Pendragon NPC Tracker – Copilot Instructions

## Overview

Client-side React web app for tracking NPC combat state in the Pendragon tabletop RPG. No backend; all data is persisted to localStorage.

## Commands

- `npm run dev` – Vite dev server
- `npm run build` – `tsc -b && vite build`
- `npm run preview` – preview production build
- `npm run lint` – ESLint (zero warnings allowed)

## Tech Stack

- React 18 + TypeScript, Vite
- Zustand (`persist` middleware, storage key in `src/utils/storage.ts`)
- Tailwind CSS (with `@tailwindcss/forms`) plus custom classes in `src/index.css`

## Project Structure

- `src/types/npc.ts` – `NPC`, `Skill`, `NPCStatus`, `NPCPosition`
- `src/store/npcStore.ts` – Zustand store: add, update, apply combat result, delete (persist `version` + `migrate`)
- `src/store/settingsStore.ts` – persisted settings (`geminiApiKey`, `geminiModel`)
- `src/services/` – `geminiClient` (HTTP, retry/backoff, typed `GeminiError`), `instructions` (loads/caches `public/npc-details-instructions.md`), `detailGenerator` (prompt builder, response schema/validation)
- `public/npc-details-instructions.md` – Gemini system instruction (setting, tech blend, naming rules)
- `src/utils/defaults.ts` – `DEFAULT_NPC`, `NPCDraft`, HP/damage formulas, `formatDamage`
- `src/utils/damage.ts` – `calculateDamage` (pure combat logic)
- `src/utils/names.ts` – name generator logic (cultures, genders, gender-filtered titles, `pickName`, `formatName`)
- `src/data/names.json` – name lists (`culture -> gender -> string[]`)
- `src/templates/` – JSON templates + `index.ts` loader/validator (`import.meta.glob`)
- `src/components/` – `App` uses `NPCList` (with `NPCCard`), `NPCForm` (with `TemplateSelector`, `NameGeneratorModal`, `GenerateDetailsModal`), `SettingsDialog`, `DamageCalculator`, `ConfirmDialog`, `Dialog`, `FilterableSelect`, `StatusBadge`

## Data Model

`NPC`: `id`, `name`, `type`, `maxHP`, `currentHP`, `armorValue`, `shieldValue`, `skills: {name, value}[]`, `con`, `siz`, `dex`, `str`, `damage` (number of d6), `glory`, `status` (`active | passive | unconscious | dead`), `position` (`mounted | on_foot | on_ground`), `notes`, `description` (Markdown, generated or edited), `summary` (plain text ≤150 chars, shown on cards), `nameGeneration?` (`{ culture, gender, title }`, last name-generator settings used), `createdAt`, `updatedAt`.

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
