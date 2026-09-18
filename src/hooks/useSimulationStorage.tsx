import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'
import { useCallback } from 'react'

const LOCAL_STORAGE_KEY = 'simulation-data'

const readSavedData = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)

  if (!storage) {
    return []
  }

  try {
    const parsed = JSON.parse(storage) as SimulationRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY)
    return []
  }
}

export const useSimulationStorage = () => {
  const saveFormData = useCallback((formData: SimulationFormData) => {
    const id = crypto.randomUUID()
    const record: SimulationRecord = {
      ...formData,
      id,
      createdAt: new Date().toISOString(),
      coachMessages: [],
    }

    const savedData = readSavedData()

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify([...savedData, record]),
    )

    return id
  }, [])

  const getAllSimulations = useCallback(() => {
    return [...readSavedData()].sort(
      (first, second) =>
        new Date(second.createdAt ?? 0).getTime() -
        new Date(first.createdAt ?? 0).getTime(),
    )
  }, [])

  const getFormData = useCallback((id: string) => {
    return readSavedData().find((record) => record.id === id) || null
  }, [])

  const updateSimulation = useCallback((id: string, data: SimulationRecord) => {
    const savedData = readSavedData()

    const updated = savedData.map((record) =>
      record.id === id ? { ...data } : record,
    )

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  }, [])

  return { saveFormData, getAllSimulations, getFormData, updateSimulation }
}
