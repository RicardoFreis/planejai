import { Bot, Send, Sparkles, UserRound } from 'lucide-react'
import type { FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/shared/Button'
import { useFinanceCoach } from '@/hooks/useFinanceCoach'

interface FinanceCoachCardProps {
  simulationId: string
}

export function FinanceCoachCard({ simulationId }: FinanceCoachCardProps) {
  const { messages, isLoading, error, sendMessage } =
    useFinanceCoach(simulationId)
  const [question, setQuestion] = useState('')
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuestion = question.trim()
    if (!trimmedQuestion || isLoading) {
      return
    }

    setQuestion('')
    await sendMessage(trimmedQuestion)
  }

  return (
    <section className="bg-card rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
          <Sparkles size={18} />
        </div>
        <div>
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            Educador Financeiro
          </p>
          <h3 className="text-foreground text-lg font-semibold">
            Converse com seu coach
          </h3>
        </div>
      </div>

      <div className="border-border bg-background/60 mb-4 flex max-h-105 flex-col gap-3 overflow-y-auto rounded-xl border p-3">
        {messages.length === 0 ? (
          <div className="border-border text-muted-foreground rounded-2xl border border-dashed p-4 text-sm">
            Pergunte sobre orçamento, metas, investimentos ou como reduzir
            despesas.
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'border-border bg-card text-foreground border'
                }`}
              >
                <div className="mb-1 flex items-center gap-1.5 font-medium">
                  {message.role === 'user' ? (
                    <UserRound size={14} />
                  ) : (
                    <Bot size={14} />
                  )}
                  {message.role === 'user' ? 'Você' : 'Educador'}
                </div>
                <p>{message.content}</p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="border-border bg-card text-muted-foreground rounded-2xl border px-3 py-2 text-sm">
              O educador está pensando na melhor resposta...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-300">
            {error}
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          rows={3}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ex.: Como posso reduzir meus gastos sem comprometer o essencial?"
          className="border-border bg-input text-foreground placeholder:text-muted-foreground focus:border-primary min-h-20 flex-1 resize-none rounded-xl border px-3 py-2 text-sm outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          disabled={isLoading || !question.trim()}
          className="self-end rounded-xl px-4"
        >
          Enviar
        </Button>
      </form>
    </section>
  )
}
