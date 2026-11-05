import type { NPC } from '../types/npc'
import { formatDamage } from '../utils/defaults'
import StatusBadge from './StatusBadge'

interface NPCCardProps {
  npc: NPC
  onEdit: () => void
  onDelete: () => void
  onHit: () => void
  onDuplicate: () => void
}

export default function NPCCard({ npc, onEdit, onDelete, onHit, onDuplicate }: NPCCardProps) {
  const position = { mounted: 'Mounted', on_foot: 'On Foot', on_ground: 'On the Ground' }[npc.position]

  return (
    <article className="npc-card">
      <header className="flex items-center justify-between">
        <h2>{npc.name} - {npc.type}</h2>
        <StatusBadge status={npc.status} />
      </header>
      <p>
        SIZ {npc.siz} · STR {npc.str} · CON {npc.con} · DEX {npc.dex} · Damage {formatDamage(npc.damage)} · HP {npc.currentHP}/
        {npc.maxHP} · Armour {npc.armorValue} · Shield {npc.shieldValue} · Glory {npc.glory}
      </p>
      <p>Position: {position}</p>
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
    </article>
  )
}
