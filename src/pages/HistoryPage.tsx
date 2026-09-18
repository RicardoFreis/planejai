import { ArrowRight, CalendarDays, PiggyBank, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

export function HistoryPage() {
    const { getAllSimulations } = useSimulationStorage()
    const simulations = getAllSimulations()

    return (
        <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
            <PageHero
                title="Histórico de simulações"
                subtitle="Revise seus planejamentos e continue de onde parou."
            />

            {simulations.length === 0 ? (
                <div className="bg-card rounded-2xl border border-dashed border-border p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
                    <PiggyBank className="mx-auto mb-4 text-primary" size={42} />
                    <h2 className="mb-2 text-xl font-semibold text-foreground">
                        Ainda não há simulações salvas
                    </h2>
                    <p className="text-muted-foreground mb-5 text-sm">
                        Crie sua primeira análise e o histórico aparecerá aqui.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                    >
                        Nova simulação <ArrowRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {simulations.map((simulation) => {
                        const income = Number(
                            simulation.income.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'),
                        )
                        const expenses = Number(
                            simulation.expenses.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'),
                        )
                        const debts = Number(
                            simulation.debts.replace(/[^\d,.-]/g, '').replace('.', '').replace(',', '.'),
                        )
                        const monthlySavings = income - expenses - debts

                        return (
                            <Link
                                key={simulation.id}
                                to={`/resultado/${simulation.id}`}
                                className="group block rounded-2xl border border-border bg-card p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1"
                            >
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-primary text-xs font-semibold uppercase tracking-widest">
                                            Meta
                                        </p>
                                        <h3 className="mt-1 text-lg font-semibold text-foreground">
                                            {simulation.goalName}
                                        </h3>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Sparkles size={18} />
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm text-muted-foreground">
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Valor</span>
                                        <span className="font-semibold text-foreground">
                                            {simulation.goalAmount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Prazo</span>
                                        <span className="font-semibold text-foreground">
                                            {simulation.goalDeadline} meses
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Economia mensal</span>
                                        <span className="font-semibold text-foreground">
                                            R${' '}
                                            {monthlySavings.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                                    <span className="inline-flex items-center gap-1">
                                        <CalendarDays size={14} />
                                        {new Date(simulation.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                    <span className="inline-flex items-center gap-1 font-medium text-primary">
                                        Ver detalhes <ArrowRight size={14} />
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </main>
    )
}
