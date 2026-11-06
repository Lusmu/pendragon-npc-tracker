import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'
import { generateDetails, type GeneratedDetails } from '../services/detailGenerator'
import { GeminiError, type GeminiErrorKind } from '../services/geminiClient'
import type { NPCDraft } from '../utils/defaults'

interface GenerateDetailsModalProps {
  isOpen: boolean
  npc: NPCDraft
  onClose: () => void
  onApply: (details: GeneratedDetails) => void
  onPendingChange?: (pending: boolean) => void
}

type Phase =
  | { kind: 'input' }
  | { kind: 'loading' }
  | { kind: 'preview'; details: GeneratedDetails }
  | { kind: 'error'; errorKind: GeminiErrorKind; message: string }

const ERROR_MESSAGES: Record<GeminiErrorKind, string> = {
  auth: 'The Gemini API rejected the key. Verify your API key in Settings.',
  rate_limit: 'Gemini rate limit reached. Wait a moment and retry.',
  safety: 'The request was filtered by Gemini safety settings. Try different guidance.',
  network: 'Could not reach the Gemini API.',
  invalid_response: 'Gemini returned an unexpected response.',
  other: 'Generation failed.',
}

export default function GenerateDetailsModal({ isOpen, ...props }: GenerateDetailsModalProps) {
  if (!isOpen) return null
  return <GenerateDetailsContent {...props} />
}

function GenerateDetailsContent({ npc, onClose, onApply, onPendingChange }: Omit<GenerateDetailsModalProps, 'isOpen'>) {
  const [guidance, setGuidance] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'input' })
  const abortRef = useRef<AbortController>()
  const onPendingChangeRef = useRef(onPendingChange)
  onPendingChangeRef.current = onPendingChange

  const loading = phase.kind === 'loading'

  useEffect(() => onPendingChangeRef.current?.(loading), [loading])

  useEffect(
    () => () => {
      abortRef.current?.abort()
      onPendingChangeRef.current?.(false)
    },
    [],
  )

  const generate = async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setPhase({ kind: 'loading' })
    try {
      const details = await generateDetails(npc, guidance, controller.signal)
      if (!controller.signal.aborted) setPhase({ kind: 'preview', details })
    } catch (err) {
      if (controller.signal.aborted) return
      const errorKind = err instanceof GeminiError ? err.kind : 'other'
      setPhase({ kind: 'error', errorKind, message: err instanceof Error ? err.message : String(err) })
    }
  }

  const cancel = () => {
    abortRef.current?.abort()
    onClose()
  }

  return (
    <Dialog title="Generate details" labelledBy="generate-details-title" className="dialog--wide" onClose={cancel}>
      <div className="dialog__form">
        {phase.kind !== 'preview' && (
          <label className="form-field">
            Guidance (optional)
            <textarea
              value={guidance}
              disabled={loading}
              placeholder="e.g. Make him a grizzled veteran of St Albans"
              onChange={(e) => setGuidance(e.target.value)}
            />
          </label>
        )}
        {loading && (
          <p className="loading-indicator" aria-live="polite">
            <span className="spinner" aria-hidden="true" /> Generating…
          </p>
        )}
        {phase.kind === 'preview' && (
          <>
            <p className="name-preview">{phase.details.name}</p>
            <p className="details-summary">{phase.details.summary}</p>
            <div className="details-preview" tabIndex={0} aria-label="Generated description">
              {phase.details.description}
            </div>
          </>
        )}
        {phase.kind === 'error' && (
          <div className="error-message" role="alert">
            <p>{ERROR_MESSAGES[phase.errorKind]}</p>
            <p className="error-message__detail">{phase.message}</p>
          </div>
        )}
        <div className="form-row dialog__actions">
          {phase.kind === 'preview' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  onApply(phase.details)
                  onClose()
                }}
              >
                Apply
              </button>
              <button type="button" onClick={generate}>
                Regenerate
              </button>
            </>
          ) : (
            <button type="button" onClick={generate} disabled={loading}>
              {phase.kind === 'error' ? 'Retry' : 'Generate'}
            </button>
          )}
          <button type="button" onClick={cancel}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  )
}
