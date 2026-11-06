import { useSettingsStore } from '../store/settingsStore'
import type { NPCDraft } from '../utils/defaults'
import { CULTURE_LABELS, GENDER_LABELS, TITLE_LABELS } from '../utils/names'
import { GeminiError, generateJson } from './geminiClient'
import { loadInstructions } from './instructions'

export const SUMMARY_MAX_LENGTH = 150

export interface GeneratedDetails {
  name: string
  description: string
  summary: string
}

const DETAIL_FIELDS = ['updated_name', 'physical_description', 'personality', 'ambitions', 'origin', 'card_summary'] as const
type DetailField = (typeof DETAIL_FIELDS)[number]

const DETAIL_SCHEMA = {
  type: 'OBJECT',
  properties: {
    updated_name: { type: 'STRING', description: 'Full name with optional title, cognomen, byname or kin name' },
    physical_description: { type: 'STRING', description: 'Markdown' },
    personality: { type: 'STRING', description: 'Markdown' },
    ambitions: { type: 'STRING', description: 'Markdown' },
    origin: { type: 'STRING', description: 'Markdown' },
    card_summary: { type: 'STRING', description: `Plain text, at most ${SUMMARY_MAX_LENGTH} characters` },
  },
  required: [...DETAIL_FIELDS],
  propertyOrdering: [...DETAIL_FIELDS],
}

const DESCRIPTION_SECTIONS: [DetailField, string][] = [
  ['physical_description', 'Appearance'],
  ['personality', 'Personality'],
  ['ambitions', 'Ambitions'],
  ['origin', 'Origin'],
]

const POSITION_LABELS: Record<NPCDraft['position'], string> = { mounted: 'mounted', on_foot: 'on foot', on_ground: 'on the ground' }

export function buildPrompt(npc: NPCDraft, guidance: string) {
  const lines = [`Name: ${npc.name}`, `Type: ${npc.type}`]
  if (npc.nameGeneration) {
    const { culture, gender, title } = npc.nameGeneration
    lines.push(`Culture: ${CULTURE_LABELS[culture]}`, `Gender: ${GENDER_LABELS[gender]}`)
    if (title !== 'none') lines.push(`Title: ${TITLE_LABELS[title]}`)
  }
  lines.push(
    `Attributes: SIZ ${npc.siz}, STR ${npc.str}, CON ${npc.con}, DEX ${npc.dex}`,
    `Armour ${npc.armorValue}, Shield ${npc.shieldValue}, Glory award ${npc.glory}`,
    `Current state: ${npc.status}, ${POSITION_LABELS[npc.position]}`,
  )
  if (npc.skills.length) lines.push(`Skills: ${npc.skills.map((s) => `${s.name} ${s.value}`).join(', ')}`)
  if (npc.notes.trim()) lines.push(`GM notes: ${npc.notes.trim()}`)
  if (npc.description.trim()) lines.push(`Existing description (revise or build on it):\n${npc.description.trim()}`)

  const request = guidance.trim() ? `\n\nAdditional guidance from the GM:\n${guidance.trim()}` : ''
  return `Generate details for this NPC.\n\n${lines.join('\n')}${request}`
}

function validateDetails(value: unknown): Record<DetailField, string> {
  if (typeof value !== 'object' || value === null) {
    throw new GeminiError('invalid_response', 'Gemini response was not an object.')
  }
  const record = value as Record<string, unknown>
  for (const field of DETAIL_FIELDS) {
    if (typeof record[field] !== 'string' || !(record[field] as string).trim()) {
      throw new GeminiError('invalid_response', `Gemini response is missing "${field}".`)
    }
  }
  return record as Record<DetailField, string>
}

const formatDescription = (details: Record<DetailField, string>) =>
  DESCRIPTION_SECTIONS.map(([field, heading]) => `## ${heading}\n\n${details[field].trim()}`).join('\n\n')

const truncate = (text: string, max: number) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`)

export async function generateDetails(npc: NPCDraft, guidance: string, signal?: AbortSignal): Promise<GeneratedDetails> {
  const { geminiApiKey, geminiModel } = useSettingsStore.getState()
  if (!geminiApiKey) throw new GeminiError('auth', 'No Gemini API key configured.')

  const systemInstruction = await loadInstructions()
  const raw = await generateJson({
    apiKey: geminiApiKey,
    model: geminiModel,
    systemInstruction,
    prompt: buildPrompt(npc, guidance),
    schema: DETAIL_SCHEMA,
    signal,
  })
  const details = validateDetails(raw)
  return {
    name: details.updated_name.trim(),
    description: formatDescription(details),
    summary: truncate(details.card_summary.trim().replace(/\s+/g, ' '), SUMMARY_MAX_LENGTH),
  }
}
