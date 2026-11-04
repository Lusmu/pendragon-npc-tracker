import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NPC } from '../types/npc'
import { STORAGE_KEY } from '../utils/storage'
import type { NPCDraft } from '../utils/defaults'

interface NPCStore {
  npcs: NPC[]
  addNPC: (draft: NPCDraft) => void
  updateNPC: (id: string, draft: NPCDraft) => void
  applyCombatResult: (id: string, result: Pick<NPC, 'currentHP' | 'status' | 'position'>) => void
  deleteNPC: (id: string) => void
}

export const useNPCStore = create<NPCStore>()(
  persist(
    (set) => ({
      npcs: [],
      addNPC: (draft) =>
        set((state) => {
          const now = Date.now()
          return {
            npcs: [...state.npcs, { ...draft, id: crypto.randomUUID(), createdAt: now, updatedAt: now }],
          }
        }),
      updateNPC: (id, draft) =>
        set((state) => ({
          npcs: state.npcs.map((n) => (n.id === id ? { ...n, ...draft, updatedAt: Date.now() } : n)),
        })),
      applyCombatResult: (id, result) =>
        set((state) => ({
          npcs: state.npcs.map((n) => (n.id === id ? { ...n, ...result, updatedAt: Date.now() } : n)),
        })),
      deleteNPC: (id) => set((state) => ({ npcs: state.npcs.filter((n) => n.id !== id) })),
    }),
    { name: STORAGE_KEY },
  ),
)
