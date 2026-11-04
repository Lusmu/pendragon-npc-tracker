import { useId, useMemo, useState } from 'react'

export interface FilterableOption<TValue = string> {
  label: string
  value: TValue
}

interface FilterableSelectProps<TValue = string> {
  options: FilterableOption<TValue>[]
  placeholder: string
  ariaLabel: string
  noResultsText: string
  onSelect: (value: TValue) => void
}

export default function FilterableSelect<TValue>({
  options,
  placeholder,
  ariaLabel,
  noResultsText,
  onSelect,
}: FilterableSelectProps<TValue>) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const listboxId = useId()
  const normalizedQuery = query.trim().toLowerCase()
  const visibleOptions = useMemo(
    () => options.filter(({ label }) => label.toLowerCase().includes(normalizedQuery)),
    [options, normalizedQuery],
  )

  return (
    <div
      className="filterable-select"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
      }}
    >
      <div className="filterable-select__control">
        <input
          aria-label={ariaLabel}
          aria-controls={listboxId}
          aria-expanded={open}
          className="filterable-select__input"
          placeholder={placeholder}
          role="combobox"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
        />
        <button
          aria-label="Toggle options"
          className="filterable-select__toggle"
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpen((prev) => !prev)}
        >
          ▾
        </button>
      </div>
      {open && (
        <ul className="filterable-select__menu" id={listboxId} role="listbox">
          {visibleOptions.map((option) => (
            <li key={option.label}>
              <button
                className="filterable-select__option"
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setQuery(option.label)
                  setOpen(false)
                  onSelect(option.value)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
          {visibleOptions.length === 0 && <li className="filterable-select__empty">{noResultsText}</li>}
        </ul>
      )}
    </div>
  )
}
