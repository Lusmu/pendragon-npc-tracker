import { useState } from 'react'
import ConfirmDialog from './components/ConfirmDialog'
import DamageCalculator from './components/DamageCalculator'
import NPCForm from './components/NPCForm'
import NPCList from './components/NPCList'
import SettingsDialog from './components/SettingsDialog'
import { useNPCStore } from './store/npcStore'
import type { NPC } from './types/npc'
import { TITLE_LABELS, generateName } from './utils/names'

const duplicateName = ({ name, nameGeneration }: NPC) => {
  if (nameGeneration) {
    const titlePrefix = `${TITLE_LABELS[nameGeneration.title]} `
    const previous = name.startsWith(titlePrefix) ? name.slice(titlePrefix.length) : name
    const generated = generateName(nameGeneration, previous)
    if (generated) return generated.name
  }
  const match = name.match(/^(.*?)(?:\s+(\d+))?$/)
  const baseName = (match?.[1] ?? name).trim()
  const existingNumber = match?.[2] ? Number(match[2]) : null
  return `${baseName} ${existingNumber === null ? 2 : existingNumber + 1}`
}

export default function App() {
  const { npcs, addNPC, updateNPC, deleteNPC, applyCombatResult } = useNPCStore()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [hitting, setHitting] = useState<NPC | null>(null)
  const [deleting, setDeleting] = useState<NPC | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const editedNPC = npcs.find((n) => n.id === editing)
  const close = () => setEditing(null)

  return (
    <main>
      <header className="flex items-center justify-between">
        <h1>Pendragon NPC Tracker</h1>
        <div className="header-actions">
          <button type="button" onClick={() => setSettingsOpen(true)}>
            Settings
          </button>
          {!editing && (
            <button type="button" onClick={() => setEditing('new')}>
              Add NPC
            </button>
          )}
        </div>
      </header>
      {editing ? (
        <NPCForm
          key={editing}
          initial={editedNPC}
          allowTemplates={!editedNPC}
          onCancel={close}
          onSubmit={(draft) => {
            if (editedNPC) updateNPC(editedNPC.id, draft)
            else addNPC(draft)
            close()
          }}
        />
      ) : (
        <NPCList
          npcs={npcs}
          onEdit={(n) => setEditing(n.id)}
          onDelete={setDeleting}
          onHit={setHitting}
          onQuickUpdate={(n, patch) => applyCombatResult(n.id, patch)}
          onDuplicate={(n) => {
            const duplicate: NPC = {
              ...n,
              id: crypto.randomUUID(),
              name: duplicateName(n),
              description: '',
              summary: '',
            }
            addNPC(duplicate)
          }}
        />
      )}
      {hitting && (
        <DamageCalculator
          npc={hitting}
          onApply={(result) => {
            applyCombatResult(hitting.id, result)
            setHitting(null)
          }}
          onCancel={() => setHitting(null)}
        />
      )}
      {settingsOpen && <SettingsDialog onClose={() => setSettingsOpen(false)} />}
      {deleting && (
        <ConfirmDialog
          title="Delete NPC?"
          message={`This will permanently delete ${deleting.name}.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => {
            deleteNPC(deleting.id)
            setDeleting(null)
          }}
          onCancel={() => setDeleting(null)}
        />
      )}
    </main>
  )
}
