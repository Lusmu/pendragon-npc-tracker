import { isBelowUnconsciousThreshold } from '../utils/labels'

interface HPBarProps {
  currentHP: number
  maxHP: number
}

export default function HPBar({ currentHP, maxHP }: HPBarProps) {
  const ratio = maxHP > 0 ? Math.min(Math.max(currentHP / maxHP, 0), 1) : 0
  const level = currentHP <= 0 ? 'down' : isBelowUnconsciousThreshold(currentHP, maxHP) ? 'low' : 'ok'

  return (
    <div className="hp-bar-row">
      <span className="hp-bar__label">
        HP {currentHP}/{maxHP}
      </span>
      <div
        className="hp-bar"
        role="meter"
        aria-label="Hit points"
        aria-valuemin={0}
        aria-valuemax={maxHP}
        aria-valuenow={Math.max(currentHP, 0)}
      >
        <div className={`hp-bar__fill hp-bar__fill--${level}`} style={{ width: `${ratio * 100}%` }} />
        <div className="hp-bar__threshold" title={`Unconscious below ${maxHP / 4} HP`} />
      </div>
    </div>
  )
}
