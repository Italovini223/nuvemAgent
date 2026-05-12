import { api } from './api'

export type PromptInfo = {
  id?: string
  name?: string
  title?: string
  description?: string
  template?: string
}

export async function fetchPrompts(): Promise<PromptInfo[]> {
  const res = await api.get('/api/prompts')
  return res.data ?? []
}

export async function fetchPromptById(id: string): Promise<PromptInfo | null> {
  try {
    const res = await api.get(`/api/prompts/${encodeURIComponent(id)}`)
    return res.data ?? null
  } catch (err) {
    console.warn('fetchPromptById failed', err)
    return null
  }
}

export async function executePrompt(name: string): Promise<unknown> {
  const res = await api.post(`/api/prompts/${encodeURIComponent(name)}/execute`, {})
  return res.data
}
