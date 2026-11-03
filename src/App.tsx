import NPCList from './components/NPCList'
import { useNPCStore } from './store/npcStore'

export default function App() {
  const npcs = useNPCStore((state) => state.npcs)

  return (
    <main>
      <h1>Pendragon NPC Tracker</h1>
      <NPCList npcs={npcs} />
    </main>
  )
}
