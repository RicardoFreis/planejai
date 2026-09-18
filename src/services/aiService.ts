import { buildCoachPrompt } from '@/data/aiPrompt'
import type { SimulationRecord } from '@/data/simulation'

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  investment: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const MODEL_NAME = 'gemini-3-flash-preview'
const REQUEST_TIMEOUT_MS = 15_000

const callGeminiAPI = async (prompt: string) => {
  if (!API_KEY) {
    throw new Error(
      'Chave da API do Gemini não configurada. Defina VITE_GEMINI_API_KEY no arquivo .env.local.',
    )
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  )

  let response: Response

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      },
    )
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('A resposta do educador demorou mais que o esperado.')
    }

    throw new Error('Não foi possível conectar ao serviço do educador.')
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const responseBody = await response.text()

    let providerMessage = ''

    try {
      const errorData = JSON.parse(responseBody) as {
        error?: { message?: string }
      }
      providerMessage = errorData.error?.message ?? ''
    } catch {
      providerMessage = ''
    }

    throw new Error(
      `O serviço do educador retornou ${response.status}${providerMessage ? `: ${providerMessage}` : '.'}`,
    )
  }

  return (await response.json()) as GeminiResponse
}

const extractText = (response: GeminiResponse) => {
  const candidate = response.candidates?.[0]
  const text = candidate?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Resposta vazia da IA.')
  }

  return text
}

export const getInsight = async (prompt: string) => {
  const response = await callGeminiAPI(prompt)
  const json = extractText(response)
  return JSON.parse(json) as InsightData
}

export const getCoachReply = async (
  simulation: SimulationRecord,
  question: string,
) => {
  const response = await callGeminiAPI(buildCoachPrompt(simulation, question))
  const text = extractText(response).trim()
  return text.replace(/^```json\s*|```$/g, '').trim()
}
