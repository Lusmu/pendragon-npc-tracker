import Markdown from 'react-markdown'
import Dialog from './Dialog'

interface DescriptionDialogProps {
  name: string
  description: string
  onClose: () => void
}

export default function DescriptionDialog({ name, description, onClose }: DescriptionDialogProps) {
  return (
    <Dialog title={name} labelledBy="description-dialog-title" className="dialog--wide" onClose={onClose}>
      <div className="markdown-content" tabIndex={0} aria-label="Description">
        <Markdown>{description}</Markdown>
      </div>
      <div className="form-row dialog__actions">
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </Dialog>
  )
}
