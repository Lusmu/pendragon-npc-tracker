import type { NameSettings } from '../utils/names'

export type NPCStatus = 'active' | 'passive' | 'unconscious' | 'dead'

export type NPCPosition = 'mounted' | 'on_foot' | 'on_ground'

export interface Skill {
  name: string
  value: number
}

export interface NPC {
  id: string
  name: string
  type: string
  maxHP: number
  currentHP: number
  armorValue: number
  shieldValue: number
  skills: Skill[]
  con: number
  siz: number
  dex: number
  str: number
  damage: number
  glory: number
  status: NPCStatus
  position: NPCPosition
  notes: string
  description: string
  summary: string
  nameGeneration?: NameSettings
  createdAt: number
  updatedAt: number
}
