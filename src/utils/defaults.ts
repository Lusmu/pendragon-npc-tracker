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
}

export const NPC_TEMPLATES: { name: string; npc: NPCDraft }[] = [
  { name: 'Spearman (Default)', npc: DEFAULT_NPC },
  {
    name: 'Veteran Knight (Dummy)',
    npc: {
      name: 'Veteran Knight',
      type: 'Knight',
      siz: 15,
      str: 16,
      con: 15,
      dex: 13,
      skills: [{ name: 'Sword', value: 18 }, { name: 'Lance', value: 16 }],
      damage: 5,
      maxHP: 30,
      currentHP: 30,
      armorValue: 10,
      shieldValue: 10,
      glory: 1000,
      status: 'active',
      position: 'mounted',
      notes: '',
    },
  },
  {
    name: 'Village Farmer (Dummy)',
    npc: {
      name: 'Village Farmer',
      type: 'Peasant',
      siz: 11,
      str: 10,
      con: 12,
      dex: 10,
      skills: [{ name: 'Farm', value: 12 }, { name: 'Brawling', value: 8 }],
      damage: 4,
      maxHP: 23,
      currentHP: 23,
      armorValue: 0,
      shieldValue: 0,
      glory: 0,
      status: 'active',
      position: 'on_foot',
      notes: '',
    },
  },
]

export const formatDamage = (dice: number) => `${dice}D6`

export const calcTotalHP = (siz: number, con: number) => siz + con

export const calcDamage = (str: number, siz: number) => Math.round((str + siz) / 6)
