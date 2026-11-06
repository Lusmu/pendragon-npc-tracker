import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SETTINGS_STORAGE_KEY } from '../utils/storage'

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash'
const RETIRED_MODELS = ['gemini-2.5-flash']

interface SettingsStore {
  geminiApiKey: string
  geminiModel: string
  saveSettings: (settings: { geminiApiKey: string; geminiModel: string }) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      geminiModel: DEFAULT_GEMINI_MODEL,
      saveSettings: ({ geminiApiKey, geminiModel }) =>
        set({ geminiApiKey: geminiApiKey.trim(), geminiModel: geminiModel.trim() || DEFAULT_GEMINI_MODEL }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 1,
      migrate: (persisted) => {
        const state = persisted as SettingsStore
        if (RETIRED_MODELS.includes(state.geminiModel)) state.geminiModel = DEFAULT_GEMINI_MODEL
        return state
      },
    },
  ),
)
