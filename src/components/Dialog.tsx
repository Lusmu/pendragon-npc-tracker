import { useEffect, useRef, type PropsWithChildren, type ReactNode } from 'react'

interface DialogProps extends PropsWithChildren {
  title: ReactNode
  labelledBy: string
  className?: string
  onClose?: () => void
}

const FOCUSABLE = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'

export default function Dialog({ title, labelledBy, className, onClose, children }: DialogProps) {
  const dialogClassName = className ? `dialog ${className}` : 'dialog'
  const sectionRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const focusables = () => Array.from(section.querySelectorAll<HTMLElement>(FOCUSABLE))
    focusables()[0]?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !section.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !section.contains(document.activeElement))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [])

  return (
    <div className="dialog-backdrop">
      <section
        ref={sectionRef}
        className={dialogClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <h2 id={labelledBy}>{title}</h2>
        {children}
      </section>
    </div>
  )
}
