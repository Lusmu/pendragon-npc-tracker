import type { NPCPosition, NPCStatus } from '../types/npc'

export const STATUS_LABELS: Record<NPCStatus, string> = {
  active: 'Active',
  passive: 'Passive',
  unconscious: 'Unconscious',
  dead: 'Dead',
}

export const POSITION_LABELS: Record<NPCPosition, string> = {
  mounted: 'Mounted',
  on_foot: 'On Foot',
  on_ground: 'On the Ground',
}

export const isBelowUnconsciousThreshold = (currentHP: number, maxHP: number) => currentHP < maxHP / 4
