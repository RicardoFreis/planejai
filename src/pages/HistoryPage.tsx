import {
  ArrowRight,
  CalendarDays,
  PiggyBank,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function HistoryPage() {
  const { clearAllSimulations, deleteSimulation, getAllSimulations } =
    useSimulationStorage()
  const [simulations, setSimulations] = useState(getAllSimulations)

  const handleDeleteSimulation = (id: string, goalName: string) => {
    if (!window.confirm(`Excluir a simulação "${goalName}" do histórico?`)) {
      return
    }

    deleteSimulation(id)
    setSimulations(getAllSimulations())
  }

  const handleClearHistory = () => {
    if (!window.confirm('Excluir todas as simulações do histórico?')) {
      return
    }

    clearAllSimulations()
    setSimulations([])
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Revise seus planejamentos e continue de onde parou."
      />

      {simulations.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={handleClearHistory}
            className="border-border text-muted-foreground hover:text-destructive inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Limpar histórico
          </button>
        </div>
      )}

      {simulations.length === 0 ? (
        <div className="bg-card border-border rounded-2xl border border-dashed p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <PiggyBank className="text-primary mx-auto mb-4" size={42} />
          <h2 className="text-foreground mb-2 text-xl font-semibold">
            Ainda não há simulações salvas
          </h2>
          <p className="text-muted-foreground mb-5 text-sm">
            Crie sua primeira análise e o histórico aparecerá aqui.
          </p>
          <Link
            to="/"
            className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Nova simulação <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {simulations.map((simulation) => {
            const income = Number(
              simulation.income
                .replace(/[^\d,.-]/g, '')
                .replace('.', '')
                .replace(',', '.'),
            )
            const expenses = Number(
              simulation.expenses
                .replace(/[^\d,.-]/g, '')
                .replace('.', '')
                .replace(',', '.'),
            )
            const debts = Number(
              simulation.debts
                .replace(/[^\d,.-]/g, '')
                .replace('.', '')
                .replace(',', '.'),
            )
            const monthlySavings = income - expenses - debts

            return (
              <article
                key={simulation.id}
                className="group border-border bg-card block rounded-2xl border p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-primary text-xs font-semibold tracking-widest uppercase">
                      Meta
                    </p>
                    <h3 className="text-foreground mt-1 text-lg font-semibold">
                      {simulation.goalName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                      <Sparkles size={18} />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteSimulation(
                          simulation.id,
                          simulation.goalName,
                        )
                      }
                      aria-label={`Excluir simulação ${simulation.goalName}`}
                      title="Excluir simulação"
                      className="border-border text-muted-foreground hover:text-destructive flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="text-muted-foreground space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span>Nome</span>
                    <span className="text-foreground font-semibold">
                      {simulation.yourName || 'Não informado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span>Idade</span>
                    <span className="text-foreground font-semibold">
                      {simulation.yourAge || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Valor</span>
                    <span className="text-foreground font-semibold">
                      {simulation.goalAmount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Prazo</span>
                    <span className="text-foreground font-semibold">
                      {simulation.goalDeadline} meses
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Economia mensal</span>
                    <span className="text-foreground font-semibold">
                      R${' '}
                      {monthlySavings.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="border-border text-muted-foreground mt-5 flex items-center justify-between border-t pt-4 text-xs">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />
                    {new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <Link
                    to={`/resultado/${simulation.id}`}
                    className="text-primary inline-flex items-center gap-1 font-medium"
                  >
                    Ver detalhes <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
