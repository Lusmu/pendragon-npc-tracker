import { useState } from 'react'
import { NPC_TEMPLATES, type NPCDraft } from '../utils/defaults'

interface TemplateSelectorProps {
  onSelect: (npc: NPCDraft) => void
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  const [selected, setSelected] = useState('')

  return (
    <label className="form-field form-field--wide">
      Template
      <select
        aria-label="NPC template"
        value={selected}
        onChange={(event) => {
          const template = NPC_TEMPLATES.find(({ name }) => name === event.target.value)
          if (template) {
            onSelect({ ...template.npc, skills: template.npc.skills.map((skill) => ({ ...skill })) })
            setSelected('')
          }
        }}
      >
        <option value="">Choose a template…</option>
        {NPC_TEMPLATES.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>
  )
}
