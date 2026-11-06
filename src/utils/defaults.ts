import type { NPC } from '../types/npc'

export type NPCDraft = Omit<NPC, 'id' | 'createdAt' | 'updatedAt'>

export const DEFAULT_NPC: NPCDraft = {
  name: 'Spearman',
  type: 'Spearman',
  siz: 12,
  str: 12,
  con: 14,
  dex: 11,
  skills: [
    { name: 'Spear', value: 15 },
    { name: 'Dagger', value: 10 },
  ],
  damage: 4,
  maxHP: 26,
  currentHP: 26,
  armorValue: 5,
  shieldValue: 6,
  glory: 25,
  status: 'active',
  position: 'on_foot',
  notes: '',
  description: '',
  summary: '',
}

export const formatDamage = (dice: number) => `${dice}D6`

export const calcTotalHP = (siz: number, con: number) => siz + con

export const calcDamage = (str: number, siz: number) => Math.round((str + siz) / 6)
