import type { NPC, NPCPosition, NPCStatus } from '../types/npc'
import { isBelowUnconsciousThreshold } from './labels'

export type WoundSize = 'None' | 'Minor' | 'Major' | 'Mortal'

export interface DamageResult {
  incomingDamage: number
  damageTaken: number
  woundSize: WoundSize
  currentHP: number
  status: NPCStatus
  position: NPCPosition
  knockdown: 'none' | 'check' | 'automatic'
}

export function calculateDamage(npc: NPC, damage: number, shieldUsed: boolean): DamageResult {
  const incomingDamage = Math.max(0, Math.trunc(Number.isFinite(damage) ? damage : 0))
  const protection = Math.max(0, npc.armorValue) + (shieldUsed ? Math.max(0, npc.shieldValue) : 0)
  const damageTaken = Math.max(0, incomingDamage - protection)
  const currentHP = npc.currentHP - damageTaken
  const woundSize: WoundSize =
    damageTaken <= 0
      ? 'None'
      : damageTaken >= npc.maxHP
        ? 'Mortal'
        : damageTaken >= npc.con
          ? 'Major'
          : 'Minor'
  const knockdown = incomingDamage > npc.siz * 2 ? 'automatic' : incomingDamage > npc.siz ? 'check' : 'none'
  const knockedDown = knockdown === 'automatic'
  const status =
    currentHP <= 0
      ? 'dead'
      : isBelowUnconsciousThreshold(currentHP, npc.maxHP) || woundSize === 'Major' || woundSize === 'Mortal'
        ? 'unconscious'
        : npc.status

  return {
    incomingDamage,
    damageTaken,
    woundSize,
    currentHP,
    status,
    position: knockedDown ? 'on_ground' : npc.position,
    knockdown,
  }
}
