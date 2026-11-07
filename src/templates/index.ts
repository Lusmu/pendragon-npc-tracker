import type { NPCPosition, NPCStatus } from '../types/npc'
import type { NPCDraft } from '../utils/defaults'
import { CULTURES, GENDERS, TITLES, isTitleAllowed, type NameSettings } from '../utils/names'

export interface NPCTemplate {
  name: string
  npc: NPCDraft
  nameGeneration?: NameSettings
}

// Developer workflow:
// 1) copy an existing JSON file in src/templates/
// 2) edit its "name" + "npc" values (optionally "nameGeneration": { culture, gender, title? })
// 3) delete a file to remove a template
const TEMPLATE_FILES = import.meta.glob('./*.json', { eager: true, import: 'default' }) as Record<string, unknown>

export const statuses: NPCStatus[] = ['active', 'passive', 'unconscious', 'dead']
export const positions: NPCPosition[] = ['mounted', 'on_foot', 'on_ground']

export const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null
const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

const readString = (value: unknown, context: string) => {
  if (typeof value !== 'string') throw new Error(`${context} must be a string`)
  return value
}

const readOptionalString = (value: unknown, context: string) => (value === undefined ? '' : readString(value, context))

const readNumber = (value: unknown, context: string) => {
  if (!isFiniteNumber(value)) throw new Error(`${context} must be a finite number`)
  return value
}

const readEnum = <T extends string>(value: unknown, allowed: readonly T[], context: string): T => {
  if (typeof value === 'string' && allowed.includes(value as T)) return value as T
  throw new Error(`${context} must be one of: ${allowed.join(', ')}`)
}

export const readNameSettings = (value: unknown, context: string): NameSettings | undefined => {
  if (value === undefined) return undefined
  if (!isRecord(value)) throw new Error(`${context} must be an object`)
  const gender = readEnum(value.gender, GENDERS, `${context}.gender`)
  const title = value.title === undefined ? 'none' : readEnum(value.title, TITLES, `${context}.title`)
  if (!isTitleAllowed(title, gender)) throw new Error(`${context}.title "${title}" is not allowed for gender "${gender}"`)
  return { culture: readEnum(value.culture, CULTURES, `${context}.culture`), gender, title }
}

const readStatus = (value: unknown, context: string) => readEnum(value, statuses, context)
const readPosition = (value: unknown, context: string) => readEnum(value, positions, context)

export const readSkills = (value: unknown, context: string): NPCDraft['skills'] => {
  if (!Array.isArray(value)) throw new Error(`${context} must be an array`)
  return value.map((skill, index) => {
    if (!isRecord(skill)) throw new Error(`${context}[${index}] must be an object`)
    return {
      name: readString(skill.name, `${context}[${index}].name`),
      value: readNumber(skill.value, `${context}[${index}].value`),
    }
  })
}

const readNPCDraft = (value: unknown, context: string): NPCDraft => {
  if (!isRecord(value)) throw new Error(`${context} must be an object`)

  return {
    name: readString(value.name, `${context}.name`),
    type: readString(value.type, `${context}.type`),
    siz: readNumber(value.siz, `${context}.siz`),
    str: readNumber(value.str, `${context}.str`),
    con: readNumber(value.con, `${context}.con`),
    dex: readNumber(value.dex, `${context}.dex`),
    skills: readSkills(value.skills, `${context}.skills`),
    damage: readNumber(value.damage, `${context}.damage`),
    maxHP: readNumber(value.maxHP, `${context}.maxHP`),
    currentHP: readNumber(value.currentHP, `${context}.currentHP`),
    armorValue: readNumber(value.armorValue, `${context}.armorValue`),
    shieldValue: readNumber(value.shieldValue, `${context}.shieldValue`),
    glory: readNumber(value.glory, `${context}.glory`),
    status: readStatus(value.status, `${context}.status`),
    position: readPosition(value.position, `${context}.position`),
    notes: readString(value.notes, `${context}.notes`),
    description: readOptionalString(value.description, `${context}.description`),
    summary: readOptionalString(value.summary, `${context}.summary`),
  }
}

const parseTemplate = (value: unknown, filePath: string): NPCTemplate => {
  if (!isRecord(value)) throw new Error(`Template file "${filePath}" must contain an object`)
  return {
    name: readString(value.name, `Template file "${filePath}" field "name"`),
    npc: readNPCDraft(value.npc, `Template file "${filePath}" field "npc"`),
    nameGeneration: readNameSettings(value.nameGeneration, `Template file "${filePath}" field "nameGeneration"`),
  }
}

const entries = Object.entries(TEMPLATE_FILES).map(([filePath, raw]) => parseTemplate(raw, filePath))

export const NPC_TEMPLATES: NPCTemplate[] = entries.sort((a, b) => a.name.localeCompare(b.name))
