import { useState } from 'react'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  'aria-label'?: string
}

const toInt = (v: string) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

export default function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  const [cleared, setCleared] = useState(false)

  return (
    <input
      {...rest}
      type="number"
      // Must be a string: React compares a number loosely against the DOM value, so "05" would survive.
      value={cleared && value === 0 ? '' : String(value)}
      onChange={(e) => {
        setCleared(e.target.value === '')
        onChange(toInt(e.target.value))
      }}
      onBlur={() => setCleared(false)}
    />
  )
}
