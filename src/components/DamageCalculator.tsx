import { useState } from 'react'
import type { NPC } from '../types/npc'
import { calculateDamage, type DamageResult } from '../utils/damage'
import Dialog from './Dialog'

interface DamageCalculatorProps {
  npc: NPC
  onApply: (result: DamageResult) => void
  onCancel: () => void
}

export default function DamageCalculator({ npc, onApply, onCancel }: DamageCalculatorProps) {
  const [damage, setDamage] = useState('0')
  const [shieldUsed, setShieldUsed] = useState(false)
  const [result, setResult] = useState<DamageResult | null>(null)

  return (
    <Dialog
      title={result ? 'Damage result' : `Hit ${npc.name}`}
      labelledBy="damage-dialog-title"
      className="damage-dialog"
      onClose={onCancel}
    >
      {result ? (
        <>
          <dl>
            <div><dt>Wound size</dt><dd>{result.woundSize}</dd></div>
            <div><dt>Damage taken</dt><dd>{result.damageTaken}</dd></div>
            <div><dt>Hit points</dt><dd>{npc.currentHP} → {result.currentHP} / {npc.maxHP}</dd></div>
            <div>
              <dt>Status</dt>
              <dd>{result.status === npc.status ? result.status : `${npc.status} → ${result.status}`}</dd>
            </div>
            <div>
              <dt>Position</dt>
              <dd>
                {result.position === npc.position
                  ? result.position.replace('_', ' ')
                  : `${npc.position.replace('_', ' ')} → ${result.position.replace('_', ' ')}`}
              </dd>
            </div>
            <div>
              <dt>Knockdown</dt>
              <dd>
                {result.knockdown === 'automatic'
                  ? 'Automatic knockdown'
                  : result.knockdown === 'check'
                    ? `DEX ${npc.dex} knockdown check required`
                    : 'None'}
              </dd>
            </div>
          </dl>
          <div className="form-row">
            <button type="button" onClick={() => onApply(result)}>Apply</button>
            <button type="button" onClick={onCancel}>Back</button>
          </div>
        </>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setResult(calculateDamage(npc, Number(damage), shieldUsed))
          }}
        >
          <label className="form-field">
            Damage received
            <input
              type="number"
              min="0"
              step="1"
              required
              value={damage}
              onChange={(event) => setDamage(event.target.value)}
            />
          </label>
          <label className="damage-dialog__checkbox">
            <input
              type="checkbox"
              checked={shieldUsed}
              disabled={npc.shieldValue <= 0}
              onChange={(event) => setShieldUsed(event.target.checked)}
            />
            Use shield (protection {npc.shieldValue})
          </label>
          <div className="form-row">
            <button type="submit">Hit</button>
            <button type="button" onClick={onCancel}>Back</button>
          </div>
        </form>
      )}
    </Dialog>
  )
}
