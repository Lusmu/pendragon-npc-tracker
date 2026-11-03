import type { NPC } from '../types/npc'
import StatusBadge from './StatusBadge'

interface NPCCardProps {
  npc: NPC
}

export default function NPCCard({ npc }: NPCCardProps) {
  return (
    <article className="npc-card">
      <h2>{npc.name}</h2>
      <p>{npc.type}</p>
      <StatusBadge status={npc.status} />
    </article>
  )
}
