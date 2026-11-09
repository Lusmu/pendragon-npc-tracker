import { useState } from 'react'
import type { NPC } from '../types/npc'
import { formatDamage } from '../utils/defaults'
import DescriptionDialog from './DescriptionDialog'
import HPBar from './HPBar'
import { PositionSelect, StatusSelect } from './StatusPositionSelects'

interface NPCCardProps {
  npc: NPC
  onEdit: () => void
  onDelete: () => void
  onHit: () => void
  onDuplicate: () => void
  onQuickUpdate: (patch: Partial<Pick<NPC, 'status' | 'position'>>) => void
}

export default function NPCCard({ npc, onEdit, onDelete, onHit, onDuplicate, onQuickUpdate }: NPCCardProps) {
  const [showDescription, setShowDescription] = useState(false)
  const hasDescription = npc.description.trim() !== ''

  return (
    <article className="npc-card">
      <header className="flex items-center justify-between">
        <h2>{npc.name} - {npc.type}</h2>
        <div className="badge-group">
          <PositionSelect badge position={npc.position} onChange={(position) => onQuickUpdate({ position })} />
          <StatusSelect badge status={npc.status} onChange={(status) => onQuickUpdate({ status })} />
        </div>
      </header>
      {(npc.summary || hasDescription) && (
        <div className="npc-card__summary-row">
          {npc.summary && <p className="npc-card__summary">{npc.summary}</p>}
          {hasDescription && (
            <button type="button" className="button-subtle" onClick={() => setShowDescription(true)}>
              Description
            </button>
          )}
        </div>
      )}
      <p>
        SIZ {npc.siz} · STR {npc.str} · CON {npc.con} · DEX {npc.dex} · Damage {formatDamage(npc.damage)}
        · Armour {npc.armorValue} · Shield {npc.shieldValue} · Glory {npc.glory}
      </p>
      <HPBar currentHP={npc.currentHP} maxHP={npc.maxHP} />
      {npc.skills.length > 0 && <p>{npc.skills.map((s) => `${s.name} (${s.value})`).join(', ')}</p>}
      <p>{npc.notes}</p>
      <div className="form-row">
        <button type="button" onClick={onHit} disabled={npc.status === 'dead'}>
          Hit
        </button>
        <button type="button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="ml-auto button-negative" onClick={onDelete}>
          Delete
        </button>
      </div>
      {showDescription && (
        <DescriptionDialog name={npc.name} description={npc.description} onClose={() => setShowDescription(false)} />
      )}
    </article>
  )
}
