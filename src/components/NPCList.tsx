import type { NPC } from '../types/npc'
import NPCCard from './NPCCard'

interface NPCListProps {
  npcs: NPC[]
}

export default function NPCList({ npcs }: NPCListProps) {
  if (npcs.length === 0) {
    return <p>No NPCs in this scene.</p>
  }

  return (
    <section aria-label="NPCs">
      {npcs.map((npc) => (
        <NPCCard key={npc.id} npc={npc} />
      ))}
    </section>
  )
}
