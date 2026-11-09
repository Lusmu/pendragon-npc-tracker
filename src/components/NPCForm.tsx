import { useState } from 'react'
import type { NPCStatus, NPCPosition } from '../types/npc'
import type { NPCTemplate } from '../templates'
import { DEFAULT_NPC, calcDamage, calcTotalHP, formatDamage, type NPCDraft } from '../utils/defaults'
import { generateName } from '../utils/names'
import { SUMMARY_MAX_LENGTH } from '../services/detailGenerator'
import { useSettingsStore } from '../store/settingsStore'
import ExportDialog from './ExportDialog'
import ImportDialog from './ImportDialog'
import GenerateDetailsModal from './GenerateDetailsModal'
import NameGeneratorModal from './NameGeneratorModal'
import { positionOptions, statusOptions } from './StatusPositionSelects'
import TemplateSelector from './TemplateSelector'

interface NPCFormProps {
  initial?: NPCDraft
  allowTemplates?: boolean
  onSubmit: (draft: NPCDraft) => void
  onCancel: () => void
}

const num = (v: string) => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.trunc(n) : 0
}

type NumKey = 'siz' | 'str' | 'con' | 'dex' | 'damage' | 'maxHP' | 'currentHP' | 'armorValue' | 'shieldValue' | 'glory'

export default function NPCForm({ initial = DEFAULT_NPC, allowTemplates = false, onSubmit, onCancel }: NPCFormProps) {
  const [npc, setNpc] = useState<NPCDraft>(initial)
  const [hpEdited, setHpEdited] = useState(initial.maxHP !== calcTotalHP(initial.siz, initial.con))
  const [damageEdited, setDamageEdited] = useState(initial.damage !== calcDamage(initial.str, initial.siz))
  const [nameGenOpen, setNameGenOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const hasApiKey = useSettingsStore((s) => Boolean(s.geminiApiKey))

  const replaceDraft = (draft: NPCDraft) => {
    setNpc(draft)
    setHpEdited(draft.maxHP !== calcTotalHP(draft.siz, draft.con))
    setDamageEdited(draft.damage !== calcDamage(draft.str, draft.siz))
  }

  const applyTemplate = ({ npc: draft, nameGeneration }: NPCTemplate) => {
    const generated = nameGeneration && generateName(nameGeneration)
    replaceDraft({ ...draft, name: generated ? generated.name : draft.name, nameGeneration })
  }

  const setNum = (key: NumKey, value: string) => {
    setNpc((prev) => {
      const next = { ...prev, [key]: num(value) }
      if ((key === 'siz' || key === 'con') && !hpEdited) {
        next.maxHP = calcTotalHP(next.siz, next.con)
        next.currentHP = next.maxHP
      }
      if ((key === 'siz' || key === 'str') && !damageEdited) next.damage = calcDamage(next.str, next.siz)
      if (key === 'maxHP') setHpEdited(true)
      if (key === 'damage') setDamageEdited(true)
      return next
    })
  }

  const numField = (key: NumKey, label: string) => (
    <label className="form-field">
      {label}
      <input type="number" value={npc[key]} onChange={(e) => setNum(key, e.target.value)} />
    </label>
  )

  const setSkill = (i: number, patch: Partial<{ name: string; value: number }>) =>
    setNpc((prev) => ({ ...prev, skills: prev.skills.map((s, j) => (j === i ? { ...s, ...patch } : s)) }))

  return (
    <>
      <form
        aria-label="NPC details"
        className="npc-form"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(npc)
        }}
      >
        {allowTemplates && <TemplateSelector onSelect={applyTemplate} />}
        <div className="form-field">
          <label htmlFor="npc-name">Name</label>
          <div className="input-with-action">
            <input id="npc-name" value={npc.name} onChange={(e) => setNpc({ ...npc, name: e.target.value })} />
            <button type="button" onClick={() => setNameGenOpen(true)}>
              Generate
            </button>
          </div>
        </div>
        <label className="form-field">
          Type
          <input value={npc.type} onChange={(e) => setNpc({ ...npc, type: e.target.value })} />
        </label>
        {numField('siz', 'SIZ')}
        {numField('str', 'STR')}
        {numField('con', 'CON')}
        {numField('dex', 'DEX')}
        {numField('damage', `Damage (${formatDamage(npc.damage)})`)}
        {numField('maxHP', 'Total Hit Points')}
        {numField('currentHP', 'Current Hit Points')}
        {numField('armorValue', 'Armour')}
        {numField('shieldValue', 'Shield')}
        {numField('glory', 'Glory Award')}
        <label className="form-field">
          Status
          <select value={npc.status} onChange={(e) => setNpc({ ...npc, status: e.target.value as NPCStatus })}>
            {statusOptions}
          </select>
        </label>
        <label className="form-field">
          Position
          <select value={npc.position} onChange={(e) => setNpc({ ...npc, position: e.target.value as NPCPosition })}>
            {positionOptions}
          </select>
        </label>
        <fieldset>
          <legend>Skills</legend>
          {npc.skills.map((s, i) => (
            <div key={i} className="form-row">
              <input aria-label="Skill name" value={s.name} onChange={(e) => setSkill(i, { name: e.target.value })} />
              <input
                aria-label="Skill value"
                type="number"
                value={s.value}
                onChange={(e) => setSkill(i, { value: num(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => setNpc({ ...npc, skills: npc.skills.filter((_, j) => j !== i) })}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => setNpc({ ...npc, skills: [...npc.skills, { name: '', value: 0 }] })}>
            Add skill
          </button>
        </fieldset>
        <div className="form-field form-field--wide">
          <label htmlFor="npc-description">Description</label>
          <div className="input-with-action input-with-action--top">
            <textarea
              id="npc-description"
              className="description-textarea"
              value={npc.description}
              onChange={(e) => setNpc({ ...npc, description: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              disabled={!hasApiKey}
              title={hasApiKey ? undefined : 'Set a Gemini API key in Settings'}
            >
              Generate Details
            </button>
          </div>
        </div>
        <label className="form-field form-field--wide">
          Summary
          <input
            value={npc.summary}
            maxLength={SUMMARY_MAX_LENGTH}
            onChange={(e) => setNpc({ ...npc, summary: e.target.value })}
          />
        </label>
        <label className="form-field form-field--wide">
          Notes
          <textarea value={npc.notes} onChange={(e) => setNpc({ ...npc, notes: e.target.value })} />
        </label>
        <div className="form-row">
          <button type="submit" disabled={generating}>
            Save
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          {allowTemplates && (
            <button type="button" onClick={() => setImportOpen(true)}>
              Import
            </button>
          )}
          <button type="button" onClick={() => setExportOpen(true)}>
            Export
          </button>
        </div>
      </form>
      <NameGeneratorModal
        isOpen={nameGenOpen}
        onClose={() => setNameGenOpen(false)}
        onApplyName={(name, nameGeneration) => setNpc((prev) => ({ ...prev, name, nameGeneration }))}
        initialSettings={npc.nameGeneration}
      />
      <GenerateDetailsModal
        isOpen={detailsOpen}
        npc={npc}
        onClose={() => setDetailsOpen(false)}
        onApply={(details) => setNpc((prev) => ({ ...prev, ...details }))}
        onPendingChange={setGenerating}
      />
      {exportOpen && <ExportDialog npc={npc} onClose={() => setExportOpen(false)} />}
      {importOpen && <ImportDialog npc={npc} onImport={replaceDraft} onClose={() => setImportOpen(false)} />}
    </>
  )
}
