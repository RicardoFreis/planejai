import {
  Calendar,
  CalendarClock,
  CreditCard,
  FileUser,
  Goal,
  Landmark,
  PiggyBank,
  Wallet,
} from 'lucide-react'

import type { InsightData } from '@/services/aiService'

import type { FormStepProps } from '../components/features/Simulation/FormStep'

export type CoachRole = 'user' | 'assistant'

export type CoachMessage = {
  id: string
  role: CoachRole
  content: string
  createdAt: string
}

export const simulationFormSteps = [
  // Ricardo
  {
    id: 'yourName',
    icon: FileUser,
    title: 'Queremos te conhecer melhor!',
    question: 'Qual o seu nome?',
    inputProps: {
      placeholder: 'ex: Ricardo',
      maxLength: 50,
    },
  },
  {
    id: 'yourAge',
    icon: Calendar,
    title: 'Deixe-nos saber sobre sua faixa etária!',
    question: 'Qual a sua idade?',
    inputProps: {
      placeholder: 'ex: 50 anos',
      maxLength: 20,
    },
  },
  {
    id: 'income',
    icon: PiggyBank,
    title: 'Renda mensal bruta',
    question:
      'Quanto é depositado na sua conta todo mês (somando todas as fontes)?',
    inputProps: {
      placeholder: 'ex: 5.000,00',
      prefix: 'R$',
      maxLength: 12,
    },
  },
  {
    id: 'expenses',
    icon: CreditCard,
    title: 'Custos fixos de vida',
    question:
      'Quanto você gasta mensalmente com custos fixos (aluguel, contas, etc)?',
    inputProps: {
      placeholder: 'ex: 2.000,00',
      prefix: 'R$',
      maxLength: 12,
    },
  },
  {
    id: 'debts',
    icon: Landmark,
    title: 'Dívidas / parcelas',
    question:
      'Você tem algum valor comprometido com parcelas ou empréstimos mensalmente?',
    inputProps: {
      placeholder: 'ex: 500,00',
      prefix: 'R$',
      maxLength: 12,
    },
  },
  {
    id: 'goalName',
    icon: Goal,
    title: 'Nome da meta',
    question: 'Qual o objetivo que você deseja alcançar?',
    inputProps: {
      placeholder: 'ex: Viagem para o Japão',
      maxLength: 50,
    },
  },
  {
    id: 'goalAmount',
    icon: Wallet,
    title: 'Custo da meta',
    question: 'Quanto custa realizar esse sonho?',
    inputProps: {
      placeholder: 'ex: 15.000,00',
      prefix: 'R$',
      maxLength: 12,
    },
  },
  {
    id: 'goalDeadline',
    icon: CalendarClock,
    title: 'Prazo desejado',
    question: 'Em quantos meses você planeja atingir esse objetivo?',
    inputProps: {
      type: 'number',
      placeholder: 'ex: 12',
      suffix: 'meses',
      min: 1,
      max: 120,
    },
    submitButtonProps: {
      label: 'Gerar simulação',
      emojiIcon: '✨',
    },
  },
] satisfies FormStepProps[]

export type SimulationFormData = {
  yourName: string
  yourAge: string
  income: string
  expenses: string
  debts: string
  goalName: string
  goalAmount: string
  goalDeadline: string
}

export type SimulationRecord = SimulationFormData & {
  id: string
  createdAt: string
  insight?: InsightData
  coachMessages?: CoachMessage[]
  [key: string]:
    | string
    | undefined
    | InsightData
    | CoachMessage[]
    | (() => void)
}
