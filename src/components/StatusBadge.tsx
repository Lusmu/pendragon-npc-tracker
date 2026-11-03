import type { NPCStatus } from '../types/npc'

interface StatusBadgeProps {
  status: NPCStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>
}
