import { useState } from 'react'
import type { NPC, NPCStatus } from '../types/npc'
import NPCCard from './NPCCard'

interface NPCListProps {
  npcs: NPC[]
  onEdit: (npc: NPC) => void
  onDelete: (npc: NPC) => void
  onHit: (npc: NPC) => void
  onDuplicate: (npc: NPC) => void
}

export default function NPCList({ npcs, onEdit, onDelete, onHit, onDuplicate }: NPCListProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<NPCStatus | 'all'>('all')

  const q = query.trim().toLowerCase()
  const visible = npcs.filter(
    (n) =>
      (status === 'all' || n.status === status) &&
      (!q || n.name.toLowerCase().includes(q) || n.type.toLowerCase().includes(q)),
  )

  return (
    <section aria-label="NPCs">
      <div className="form-row">
        <input
          type="search"
          aria-label="Filter NPCs"
          placeholder="Filter by name or type"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value as NPCStatus | 'all')}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="passive">Passive</option>
          <option value="unconscious">Unconscious</option>
          <option value="dead">Dead</option>
        </select>
      </div>
      {visible.length === 0 && <p>No NPCs in this scene.</p>}
      {visible.map((npc) => (
        <NPCCard
          key={npc.id}
          npc={npc}
          onEdit={() => onEdit(npc)}
          onDelete={() => onDelete(npc)}
          onHit={() => onHit(npc)}
          onDuplicate={() => onDuplicate(npc)}
        />
      ))}
    </section>
  )
}
