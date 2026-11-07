import { useState } from 'react'
import type { NPCDraft } from '../utils/defaults'
import { importNPC } from '../utils/importNPC'
import Dialog from './Dialog'

interface ImportDialogProps {
  npc: NPCDraft
  onImport: (draft: NPCDraft) => void
  onClose: () => void
}

export default function ImportDialog({ npc, onImport, onClose }: ImportDialogProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState<string>()
  const [ignored, setIgnored] = useState<string[]>()

  const submit = () => {
    try {
      const result = importNPC(text, npc)
      onImport(result.draft)
      if (result.ignored.length) setIgnored(result.ignored)
      else onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <Dialog title="Import NPC" labelledBy="import-dialog-title" className="dialog--wide" onClose={onClose}>
      {ignored ? (
        <div className="dialog__form" role="status">
          <p className="dialog__hint">Imported. These fields were invalid and kept their previous values:</p>
          <ul className="dialog__list">
            {ignored.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="dialog__form">
          <p className="dialog__hint">
            Paste exported NPC JSON. Missing fields keep their current values; unknown fields are ignored.
          </p>
          <textarea
            className="export-json"
            aria-label="NPC JSON"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError(undefined)
            }}
          />
          {error && (
            <div className="error-message" role="alert">
              <p>Import failed</p>
              <p className="error-message__detail">{error}</p>
            </div>
          )}
        </div>
      )}
      <div className="form-row dialog__actions">
        {!ignored && (
          <button type="button" onClick={submit} disabled={!text.trim()}>
            Import
          </button>
        )}
        <button type="button" onClick={onClose}>
          {ignored ? 'Close' : 'Cancel'}
        </button>
      </div>
    </Dialog>
  )
}
