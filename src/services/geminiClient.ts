export type GeminiErrorKind = 'auth' | 'rate_limit' | 'safety' | 'network' | 'invalid_response' | 'other'

export class GeminiError extends Error {
  constructor(
    public kind: GeminiErrorKind,
    message: string,
  ) {
    super(message)
    this.name = 'GeminiError'
  }
}

interface GenerateJsonOptions {
  apiKey: string
  model: string
  systemInstruction: string
  prompt: string
  schema: object
  signal?: AbortSignal
}

interface GeminiResponse {
  promptFeedback?: { blockReason?: string }
  candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[]
  error?: { message?: string; details?: { '@type'?: string; retryDelay?: string }[] }
}

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models'
const MAX_RETRIES = 2
const RETRYABLE = new Set([429, 503])
const BLOCKED_FINISH_REASONS = new Set(['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII'])

const retryDelayMs = (res: Response, body: GeminiResponse | undefined, attempt: number) => {
  const header = Number(res.headers.get('retry-after'))
  if (Number.isFinite(header) && header > 0) return header * 1000
  const info = body?.error?.details?.find((d) => d['@type']?.endsWith('RetryInfo'))?.retryDelay
  const seconds = info ? parseFloat(info) : NaN
  if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000
  return 1000 * 2 ** attempt
}

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })

const readBody = async (res: Response): Promise<GeminiResponse | undefined> => {
  try {
    return (await res.json()) as GeminiResponse
  } catch {
    return undefined
  }
}

export async function generateJson({ apiKey, model, systemInstruction, prompt, schema, signal }: GenerateJsonOptions) {
  const request = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: schema },
  }

  for (let attempt = 0; ; attempt++) {
    let res: Response
    try {
      res = await fetch(`${API_BASE}/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify(request),
        signal,
      })
    } catch (err) {
      if (signal?.aborted) throw err
      throw new GeminiError('network', 'Could not reach the Gemini API. Check your connection.')
    }

    const body = await readBody(res)

    if (!res.ok) {
      if (RETRYABLE.has(res.status) && attempt < MAX_RETRIES) {
        await wait(retryDelayMs(res, body, attempt), signal)
        continue
      }
      const detail = body?.error?.message ?? `HTTP ${res.status}`
      if (res.status === 401 || res.status === 403) throw new GeminiError('auth', detail)
      if (res.status === 400 && /api key/i.test(detail)) throw new GeminiError('auth', detail)
      if (res.status === 429) throw new GeminiError('rate_limit', detail)
      throw new GeminiError('other', detail)
    }

    const blockReason = body?.promptFeedback?.blockReason
    if (blockReason) throw new GeminiError('safety', `Prompt blocked (${blockReason})`)
    const candidate = body?.candidates?.[0]
    if (candidate?.finishReason && BLOCKED_FINISH_REASONS.has(candidate.finishReason)) {
      throw new GeminiError('safety', `Response blocked (${candidate.finishReason})`)
    }
    const text = candidate?.content?.parts?.map((p) => p.text ?? '').join('')
    if (!text) throw new GeminiError('invalid_response', 'Gemini returned an empty response.')
    try {
      return JSON.parse(text) as unknown
    } catch {
      throw new GeminiError('invalid_response', 'Gemini returned malformed JSON.')
    }
  }
}
