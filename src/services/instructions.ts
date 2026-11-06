let cached: Promise<string> | undefined

export function loadInstructions(): Promise<string> {
  cached ??= fetch(`${import.meta.env.BASE_URL}npc-details-instructions.md`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load generation instructions (HTTP ${res.status})`)
      return res.text()
    })
    .catch((err) => {
      cached = undefined
      throw err
    })
  return cached
}
