import { useState } from 'react'
import NPCForm from './components/NPCForm'
import NPCList from './components/NPCList'
import { useNPCStore } from './store/npcStore'

export default function App() {
  const { npcs, addNPC, updateNPC, deleteNPC } = useNPCStore()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const editedNPC = npcs.find((n) => n.id === editing)
  const close = () => setEditing(null)

  return (
    <main>
      <h1>Pendragon NPC Tracker</h1>
      {editing ? (
        <NPCForm
          key={editing}
          initial={editedNPC}
          onCancel={close}
          onSubmit={(draft) => {
            if (editedNPC) updateNPC(editedNPC.id, draft)
            else addNPC(draft)
            close()
          }}
        />
      ) : (
        <>
          <button type="button" onClick={() => setEditing('new')}>
            Add NPC
          </button>
          <NPCList npcs={npcs} onEdit={(n) => setEditing(n.id)} onDelete={deleteNPC} />
        </>
      )}
    </main>
  )
}
