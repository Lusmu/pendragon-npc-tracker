import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SETTINGS_STORAGE_KEY } from '../utils/storage'

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash'
const RETIRED_MODELS = ['gemini-2.5-flash']

export type DetailsLanguage = 'fi' | 'en'

export const LANGUAGE_LABELS: Record<DetailsLanguage, string> = { fi: 'Suomi', en: 'English' }

interface SettingsStore {
  geminiApiKey: string
  geminiModel: string
  detailsLanguage: DetailsLanguage
  saveSettings: (settings: { geminiApiKey: string; geminiModel: string }) => void
  setDetailsLanguage: (language: DetailsLanguage) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      geminiApiKey: '',
      geminiModel: DEFAULT_GEMINI_MODEL,
      detailsLanguage: 'fi',
      saveSettings: ({ geminiApiKey, geminiModel }) =>
        set({ geminiApiKey: geminiApiKey.trim(), geminiModel: geminiModel.trim() || DEFAULT_GEMINI_MODEL }),
      setDetailsLanguage: (detailsLanguage) => set({ detailsLanguage }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      version: 2,
      migrate: (persisted) => {
        const state = persisted as SettingsStore
        if (RETIRED_MODELS.includes(state.geminiModel)) state.geminiModel = DEFAULT_GEMINI_MODEL
        state.detailsLanguage ??= 'fi'
        return state
      },
    },
  ),
)
