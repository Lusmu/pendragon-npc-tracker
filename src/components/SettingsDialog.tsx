import { useState } from 'react'
import Dialog from './Dialog'
import { DEFAULT_GEMINI_MODEL, useSettingsStore } from '../store/settingsStore'

interface SettingsDialogProps {
  onClose: () => void
}

export default function SettingsDialog({ onClose }: SettingsDialogProps) {
  const { geminiApiKey, geminiModel, saveSettings } = useSettingsStore()
  const [apiKey, setApiKey] = useState(geminiApiKey)
  const [model, setModel] = useState(geminiModel)
  const [showKey, setShowKey] = useState(false)

  return (
    <Dialog title="Settings" labelledBy="settings-title" onClose={onClose}>
      <form
        className="dialog__form"
        onSubmit={(e) => {
          e.preventDefault()
          saveSettings({ geminiApiKey: apiKey, geminiModel: model })
          onClose()
        }}
      >
        <div className="form-field">
          <label htmlFor="gemini-api-key">Gemini API key</label>
          <div className="input-with-action">
            <input
              id="gemini-api-key"
              type={showKey ? 'text' : 'password'}
              autoComplete="off"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <button type="button" onClick={() => setShowKey((v) => !v)}>
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <label className="form-field">
          Gemini model
          <input value={model} placeholder={DEFAULT_GEMINI_MODEL} onChange={(e) => setModel(e.target.value)} />
        </label>
        <p className="dialog__hint">The key is stored only in this browser&apos;s localStorage.</p>
        <div className="form-row dialog__actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Dialog>
  )
}
