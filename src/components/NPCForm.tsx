import { useState } from 'react'
import type { NPCStatus, NPCPosition } from '../types/npc'
import { DEFAULT_NPC, calcTotalHP, formatDamage, type NPCDraft } from '../utils/defaults'

interface NPCFormProps {
  initial?: NPCDraft
  onSubmit: (draft: NPCDraft) => void
  onCancel: () => void
}

const num = (v: string) => {
  const n = parseInt(v, 10)
  return Number.isNaN(n) ? 0 : n
}

type NumKey = 'siz' | 'con' | 'dex' | 'damage' | 'maxHP' | 'currentHP' | 'armorValue' | 'shieldValue' | 'glory'

export default function NPCForm({ initial = DEFAULT_NPC, onSubmit, onCancel }: NPCFormProps) {
  const [npc, setNpc] = useState<NPCDraft>(initial)
  const [hpEdited, setHpEdited] = useState(initial.maxHP !== calcTotalHP(initial.siz, initial.con))

  const setNum = (key: NumKey, value: string) => {
    setNpc((prev) => {
      const next = { ...prev, [key]: num(value) }
      if ((key === 'siz' || key === 'con') && !hpEdited) {
        next.maxHP = calcTotalHP(next.siz, next.con)
        next.currentHP = next.maxHP
      }
      if (key === 'maxHP') setHpEdited(true)
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
    <form
      aria-label="NPC details"
      className="npc-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(npc)
      }}
    >
      <label className="form-field">
        Name
        <input value={npc.name} onChange={(e) => setNpc({ ...npc, name: e.target.value })} />
      </label>
      <label className="form-field">
        Type
        <input value={npc.type} onChange={(e) => setNpc({ ...npc, type: e.target.value })} />
      </label>
      {numField('siz', 'SIZ')}
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
          <option value="active">Active</option>
          <option value="passive">Passive</option>
          <option value="unconscious">Unconscious</option>
          <option value="dead">Dead</option>
        </select>
      </label>
      <label className="form-field">
        Position
        <select value={npc.position} onChange={(e) => setNpc({ ...npc, position: e.target.value as NPCPosition })}>
          <option value="mounted">Mounted</option>
          <option value="on_foot">On Foot</option>
          <option value="on_ground">On the Ground</option>
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
      <label className="form-field">
        Notes
        <textarea value={npc.notes} onChange={(e) => setNpc({ ...npc, notes: e.target.value })} />
      </label>
      <div className="form-row">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
