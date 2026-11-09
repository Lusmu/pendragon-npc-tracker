import clsx from 'clsx'
import type { NPC, NPCPosition, NPCStatus } from '../types/npc'
import { POSITION_LABELS, STATUS_LABELS } from '../utils/labels'

type StatusPosition = Pick<NPC, 'status' | 'position'>

export const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => (
  <option key={value} value={value}>
    {label}
  </option>
))

export const positionOptions = Object.entries(POSITION_LABELS).map(([value, label]) => (
  <option key={value} value={value}>
    {label}
  </option>
))

interface StatusSelectProps {
  status: NPCStatus
  onChange: (status: NPCStatus) => void
  badge?: boolean
}

export function StatusSelect({ status, onChange, badge }: StatusSelectProps) {
  return (
    <select
      aria-label="Status"
      className={clsx(badge && `status-badge status-badge--${status} badge-select`)}
      value={status}
      onChange={(e) => onChange(e.target.value as NPCStatus)}
    >
      {statusOptions}
    </select>
  )
}

interface PositionSelectProps {
  position: NPCPosition
  onChange: (position: NPCPosition) => void
  badge?: boolean
}

export function PositionSelect({ position, onChange, badge }: PositionSelectProps) {
  return (
    <select
      aria-label="Position"
      className={clsx(badge && 'status-badge position-badge badge-select')}
      value={position} onChange={(e) => onChange(e.target.value as NPCPosition)}>
      {positionOptions}
    </select>
  )
}

interface StatusPositionSelectsProps extends StatusPosition {
  onChange: (patch: StatusPosition) => void
}

export default function StatusPositionSelects({ status, position, onChange }: StatusPositionSelectsProps) {
  return (
    <div className="quick-selects">
      <StatusSelect status={status} onChange={(next) => onChange({ status: next, position })} />
      <PositionSelect position={position} onChange={(next) => onChange({ status, position: next })} />
    </div>
  )
}
