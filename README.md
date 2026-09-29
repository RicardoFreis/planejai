# Planej.ai

Aplicação web para simular metas financeiras, gerar diagnósticos com IA e acompanhar o histórico de planejamento pessoal.

## Visão geral

O Planej.ai ajuda a pessoa usuária a:

- registrar renda, gastos, dívidas e meta financeira;
- calcular a economia mensal necessária para atingir o objetivo;
- receber um diagnóstico personalizado do Educador Financeiro;
- conversar com o coach para tirar dúvidas sobre orçamento e investimentos;
- consultar o histórico de simulações realizadas no navegador.

Tudo funciona no front-end com armazenamento local em `localStorage`, sem backend próprio. A análise da IA é feita pela API do Google Gemini e os dados ficam persistidos no navegador para facilitar o acompanhamento contínuo.

---

## Funcionalidades entregues

- Formulário multi-step para cadastrar a simulação
- Cálculo da economia mensal disponível e necessária
- Diagnóstico financeiro com IA e estados de carregamento/erro
- Conversa com o Educador Financeiro em contexto da simulação atual
- Histórico de simulações com resumo de cada meta
- Persistência local para manter as simulações salvas
- Tema claro/escuro

---

## Tecnologias

- React + TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Google Gemini API

---

## O que eu(Ricardo) desenvolvi para mostrar meu aprendizado.

- Fiz um fork conforme solicitado pelo professor da Dio para meu github. 
- Baseado neste fork fiz alterações conforme as descrições abaixo definidas por mim:
  - Adicionei duas propriedades Nome e Idade para o usuário informar.
  - Adicionei também estas duas propriedades no Histórico.
  - Criei um botão para excluir cada histórico individualmente, ao clicar surge um popup com a opção de exclusão ou cancelamento.
  - Criei um botão para excluir totalmente todos os históricos, ao clicar também surge um popup com a opção de exclusão ou cancelamento.