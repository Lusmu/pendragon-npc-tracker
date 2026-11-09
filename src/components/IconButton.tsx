import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

// Icon shapes from Lucide (ISC licence)
const ICONS = {
  hit: (
    <>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" x2="19" y1="19" y2="13" />
      <line x1="16" x2="20" y1="16" y2="20" />
      <line x1="19" x2="21" y1="21" y2="19" />
    </>
  ),
  edit: (
    <>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </>
  ),
  duplicate: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  delete: (
    <>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </>
  ),
} satisfies Record<string, ReactNode>

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'title' | 'aria-label'> {
  icon: keyof typeof ICONS
  label: string
  showLabel?: boolean
}

export default function IconButton({ icon, label, showLabel = false, className, ...props }: IconButtonProps) {
  const hiddenLabelProps = showLabel ? {} : { 'aria-label': label, title: label }

  return (
    <button
      type="button"
      className={clsx('icon-button', showLabel && 'icon-button--labeled', className)}
      {...hiddenLabelProps}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {ICONS[icon]}
      </svg>
      {showLabel && label}
    </button>
  )
}
