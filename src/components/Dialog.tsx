import type { PropsWithChildren, ReactNode } from 'react'

interface DialogProps extends PropsWithChildren {
  title: ReactNode
  labelledBy: string
  className?: string
}

export default function Dialog({ title, labelledBy, className, children }: DialogProps) {
  const dialogClassName = className ? `dialog ${className}` : 'dialog'

  return (
    <div className="dialog-backdrop">
      <section className={dialogClassName} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <h2 id={labelledBy}>{title}</h2>
        {children}
      </section>
    </div>
  )
}
