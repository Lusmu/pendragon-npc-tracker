import { useRef, useState, type KeyboardEvent } from 'react'
import Dialog from './Dialog'
import {
  CULTURES,
  CULTURE_LABELS,
  GENDERS,
  GENDER_LABELS,
  TITLE_LABELS,
  formatName,
  getNames,
  pickName,
  titlesForGender,
  type Culture,
  type Gender,
  type Title,
} from '../utils/names'

interface NameGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyName: (name: string) => void
}

export default function NameGeneratorModal({ isOpen, onClose, onApplyName }: NameGeneratorModalProps) {
  if (!isOpen) return null
  return <NameGeneratorContent onClose={onClose} onApplyName={onApplyName} />
}

function NameGeneratorContent({ onClose, onApplyName }: Omit<NameGeneratorModalProps, 'isOpen'>) {
  const [gender, setGender] = useState<Gender>('male')
  const [culture, setCulture] = useState<Culture>('cymric_christian')
  const [title, setTitle] = useState<Title>('none')
  const [generatedName, setGeneratedName] = useState('')
  const [noNames, setNoNames] = useState(false)
  const lastPicked = useRef<string>()

  const titles = titlesForGender(gender)

  const resetPreview = () => {
    setGeneratedName('')
    setNoNames(false)
  }

  const changeGender = (next: Gender) => {
    setGender(next)
    if (!titlesForGender(next).includes(title)) setTitle('none')
    resetPreview()
  }

  const generate = () => {
    const picked = pickName(getNames(culture, gender), lastPicked.current)
    if (!picked) {
      setGeneratedName('')
      setNoNames(true)
      return
    }
    lastPicked.current = picked
    setNoNames(false)
    setGeneratedName(formatName(title, picked))
  }

  const apply = () => {
    onApplyName(generatedName)
    onClose()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' || e.target instanceof HTMLButtonElement) return
    e.preventDefault()
    generate()
  }

  return (
    <Dialog title="Generate name" labelledBy="name-generator-title" onClose={onClose}>
      <div className="name-generator" onKeyDown={handleKeyDown}>
        <label className="form-field">
          Gender
          <select value={gender} onChange={(e) => changeGender(e.target.value as Gender)}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {GENDER_LABELS[g]}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Culture
          <select
            value={culture}
            onChange={(e) => {
              setCulture(e.target.value as Culture)
              resetPreview()
            }}
          >
            {CULTURES.map((c) => (
              <option key={c} value={c}>
                {CULTURE_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          Title
          <select
            value={title}
            onChange={(e) => {
              setTitle(e.target.value as Title)
              resetPreview()
            }}
          >
            {titles.map((t) => (
              <option key={t} value={t}>
                {TITLE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>
        <p className={generatedName ? 'name-preview' : 'name-preview name-preview--empty'} aria-live="polite">
          {generatedName || (noNames ? 'No names available for this culture and gender' : 'Press Generate (or Enter)')}
        </p>
        <div className="form-row dialog__actions">
          <button type="button" onClick={generate}>
            Generate
          </button>
          <button type="button" onClick={apply} disabled={!generatedName}>
            Apply
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </Dialog>
  )
}
