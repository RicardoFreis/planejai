import { useCallback, useEffect, useState } from 'react'

import type { CoachMessage, SimulationRecord } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getCoachReply } from '@/services/aiService'

export const useFinanceCoach = (simulationId: string) => {
    const { getFormData, updateSimulation } = useSimulationStorage()

    const [messages, setMessages] = useState<CoachMessage[]>(() => {
        const simulation = getFormData(simulationId)
        return simulation?.coachMessages ?? []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const simulation = getFormData(simulationId)
        setMessages(simulation?.coachMessages ?? [])
    }, [getFormData, simulationId])

    const sendMessage = useCallback(
        async (question: string) => {
            const trimmedQuestion = question.trim()

            if (!trimmedQuestion) {
                return false
            }

            const simulation = getFormData(simulationId)

            if (!simulation) {
                setError('Simulação não encontrada para iniciar a conversa.')
                return false
            }

            const userMessage: CoachMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                content: trimmedQuestion,
                createdAt: new Date().toISOString(),
            }

            const currentMessages = simulation.coachMessages ?? []
            const nextMessages = [...currentMessages, userMessage]
            const nextSimulation: SimulationRecord = {
                ...simulation,
                coachMessages: nextMessages,
            }

            updateSimulation(simulationId, nextSimulation)

            setMessages(nextMessages)
            setError(null)
            setIsLoading(true)

            try {
                const reply = await getCoachReply(simulation, trimmedQuestion)
                const assistantMessage: CoachMessage = {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    content: reply,
                    createdAt: new Date().toISOString(),
                }

                const finalMessages = [...nextMessages, assistantMessage]
                const finalSimulation: SimulationRecord = {
                    ...simulation,
                    coachMessages: finalMessages,
                }

                updateSimulation(simulationId, finalSimulation)

                setMessages(finalMessages)
                return true
            } catch {
                setError('Não consegui responder agora. Tente novamente em instantes.')
                return false
            } finally {
                setIsLoading(false)
            }
        },
        [getFormData, simulationId, updateSimulation],
    )

    return { messages, isLoading, error, sendMessage }
}
