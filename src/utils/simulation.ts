import type { SimulationFormData } from '../data/simulation'
import { parseCurrency } from './currency'

export function calcMonthlySavings(data: SimulationFormData) {
  return (
    parseCurrency(data.income ?? '0') -
    parseCurrency(data.expenses ?? '0') -
    parseCurrency(data.debts ?? '0')
  )
}
