import { useRef, useState, type KeyboardEvent } from 'react'
import Dialog from './Dialog'
import {
  CULTURES,
  DEFAULT_NAME_SETTINGS,
  CULTURE_LABELS,
  GENDERS,
  GENDER_LABELS,
  TITLE_LABELS,
  generateName,
  titlesForGender,
  type Culture,
  type Gender,
  type NameSettings,
  type Title,
} from '../utils/names'

interface NameGeneratorModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyName: (name: string, settings: NameSettings) => void
  initialSettings?: NameSettings
}

export default function NameGeneratorModal({ isOpen, ...props }: NameGeneratorModalProps) {
  if (!isOpen) return null
  return <NameGeneratorContent {...props} />
}

function NameGeneratorContent({
  onClose,
  onApplyName,
  initialSettings = DEFAULT_NAME_SETTINGS,
}: Omit<NameGeneratorModalProps, 'isOpen'>) {
  const [gender, setGender] = useState<Gender>(initialSettings.gender)
  const [culture, setCulture] = useState<Culture>(initialSettings.culture)
  const [title, setTitle] = useState<Title>(initialSettings.title)
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
    const result = generateName({ culture, gender, title }, lastPicked.current)
    if (!result) {
      setGeneratedName('')
      setNoNames(true)
      return
    }
    lastPicked.current = result.picked
    setNoNames(false)
    setGeneratedName(result.name)
  }

  const apply = () => {
    onApplyName(generatedName, { culture, gender, title })
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
