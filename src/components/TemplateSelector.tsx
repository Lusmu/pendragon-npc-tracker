import { NPC_TEMPLATES, type NPCDraft } from '../utils/defaults'
import FilterableSelect from './FilterableSelect'

interface TemplateSelectorProps {
  onSelect: (npc: NPCDraft) => void
}

export default function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <label className="form-field form-field--wide">
      Template
      <FilterableSelect
        ariaLabel="NPC template"
        noResultsText="No templates match"
        options={NPC_TEMPLATES.map((template) => ({ label: template.name, value: template.name }))}
        placeholder="Choose a template…"
        onSelect={(name) => {
          const template = NPC_TEMPLATES.find((item) => item.name === name)
          if (template) onSelect({ ...template.npc, skills: template.npc.skills.map((skill) => ({ ...skill })) })
        }}
      />
    </label>
  )
}
