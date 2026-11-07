import { isRecord, positions, readNameSettings, readSkills, statuses } from '../templates'
import type { NPCDraft } from './defaults'

export interface NPCImportResult {
  draft: NPCDraft
  applied: string[]
  ignored: string[]
}

type StringKey = 'name' | 'type' | 'notes' | 'description' | 'summary'
type NumberKey = 'siz' | 'str' | 'con' | 'dex' | 'damage' | 'maxHP' | 'currentHP' | 'armorValue' | 'shieldValue' | 'glory'

const STRING_KEYS: StringKey[] = ['name', 'type', 'notes', 'description', 'summary']
const NUMBER_KEYS: NumberKey[] = ['siz', 'str', 'con', 'dex', 'damage', 'maxHP', 'currentHP', 'armorValue', 'shieldValue', 'glory']

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)

const parseJSON = (text: string): unknown => {
  try {
    return JSON.parse(text)
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Accepts an export/template object (`{ name, npc, nameGeneration }`) or a bare NPC object.
 * Missing or empty fields keep their value from `base`, unknown fields are ignored.
 * Throws when nothing usable can be read.
 */
export function importNPC(text: string, base: NPCDraft): NPCImportResult {
  if (!text.trim()) throw new Error('Paste NPC JSON to import.')
  const root = parseJSON(text)
  if (!isRecord(root)) throw new Error('Expected a JSON object, e.g. { "npc": { "name": "…" } }.')

  const source = isRecord(root.npc) ? root.npc : root
  const draft: NPCDraft = { ...base, skills: base.skills.map((s) => ({ ...s })) }
  const applied: string[] = []
  const ignored: string[] = []

  const apply = (key: string, value: unknown, read: (value: unknown) => void) => {
    if (isEmpty(value)) return
    try {
      read(value)
      applied.push(key)
    } catch (error) {
      ignored.push(error instanceof Error ? error.message : key)
    }
  }

  for (const key of STRING_KEYS)
    apply(key, source[key], (v) => {
      if (typeof v !== 'string') throw new Error(`${key} must be text`)
      draft[key] = v
    })
  for (const key of NUMBER_KEYS)
    apply(key, source[key], (v) => {
      if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${key} must be a number`)
      draft[key] = Math.trunc(v)
    })
  apply('status', source.status, (v) => {
    const status = statuses.find((s) => s === v)
    if (!status) throw new Error(`status must be one of: ${statuses.join(', ')}`)
    draft.status = status
  })
  apply('position', source.position, (v) => {
    const position = positions.find((p) => p === v)
    if (!position) throw new Error(`position must be one of: ${positions.join(', ')}`)
    draft.position = position
  })
  apply('skills', source.skills, (v) => {
    draft.skills = readSkills(v, 'skills')
  })
  apply('nameGeneration', root.nameGeneration ?? source.nameGeneration, (v) => {
    draft.nameGeneration = readNameSettings(v, 'nameGeneration')
  })

  if (!applied.length) {
    const reason = ignored.length ? ` Invalid fields: ${ignored.join('; ')}.` : ''
    throw new Error(`No NPC fields could be imported.${reason}`)
  }
  return { draft, applied, ignored }
}
