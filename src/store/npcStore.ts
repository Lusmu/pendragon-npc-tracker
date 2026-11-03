import { create } from 'zustand'
import type { NPC } from '../types/npc'

interface NPCStore {
  npcs: NPC[]
}

export const useNPCStore = create<NPCStore>(() => ({
  npcs: [],
}))
