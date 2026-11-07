import { useMemo, useRef, useState } from 'react'
import type { NPCTemplate } from '../templates'
import type { NPCDraft } from '../utils/defaults'
import Dialog from './Dialog'

interface ExportDialogProps {
  npc: NPCDraft
  onClose: () => void
}

type CopyState = 'idle' | 'copied' | 'failed'

// Same shape as files in src/templates/, so an export can be saved as a template.
const toTemplate = ({ nameGeneration, ...npc }: NPCDraft): NPCTemplate => ({
  name: npc.name,
  npc,
  ...(nameGeneration && { nameGeneration }),
})

export default function ExportDialog({ npc, onClose }: ExportDialogProps) {
  const json = useMemo(() => JSON.stringify(toTemplate(npc), null, 2), [npc])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const copy = async () => {
    textareaRef.current?.select()
    try {
      await navigator.clipboard.writeText(json)
      setCopyState('copied')
    } catch {
      setCopyState('failed')
    }
  }

  return (
    <Dialog title="Export NPC" labelledBy="export-dialog-title" className="dialog--wide" onClose={onClose}>
      <div className="dialog__form">
        <textarea
          ref={textareaRef}
          className="export-json"
          aria-label="NPC JSON"
          value={json}
          readOnly
          onFocus={(e) => e.target.select()}
        />
        <p className="dialog__hint" role="status">
          {copyState === 'copied' && 'Copied to clipboard.'}
          {copyState === 'failed' && 'Copy failed. Text is selected; press Ctrl+C to copy.'}
        </p>
      </div>
      <div className="form-row dialog__actions">
        <button type="button" onClick={copy}>
          Copy to clipboard
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  )
}
