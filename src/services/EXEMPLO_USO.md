/**
 * EXEMPLO DE USO - Funcionalidade de Agendamento via WhatsApp
 * 
 * Este arquivo demonstra como usar o sistema de agendamento com integração WhatsApp
 * em diferentes contextos da aplicação.
 */

// ============================================================================
// EXEMPLO 1: Usando o Hook useScheduling em um Componente
// ============================================================================

import { useState } from "react";
import { useScheduling } from "@/hooks/useScheduling";

function ExemploComponenteAgendamento() {
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
  });

  const { sendScheduling, isLoading, error, clearError } = useScheduling();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await sendScheduling(
        {
          name: formData.name,
          service: formData.service,
        },
        formData.date, // Formato: YYYY-MM-DD (do input type="date")
        formData.time  // Formato: HH:MM
      );

      // Sucesso - WhatsApp será aberto automaticamente
      console.log("Agendamento enviado com sucesso!");
    } catch (err) {
      console.error("Erro ao enviar:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Seu nome"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <select
        value={formData.service}
        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
        required
      >
        <option value="">Selecione um serviço</option>
        <option value="Aplicação natural">Aplicação natural</option>
        <option value="Manutenção">Manutenção</option>
      </select>

      <input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <input
        type="time"
        value={formData.time}
        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        required
      />

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Agendar via WhatsApp"}
      </button>
    </form>
  );
}

// ============================================================================
// EXEMPLO 2: Usando o Serviço Diretamente
// ============================================================================

import {
  formatSchedulingMessage,
  validateSchedulingData,
  generateWhatsAppUrl,
  openWhatsAppWithScheduling,
  type SchedulingData,
} from "@/services/whatsappService";

async function exemploUsandoServicoDirectamente() {
  // Dados do agendamento
  const schedulingData: SchedulingData = {
    name: "João Silva",
    service: "Aplicação natural",
    date: "22/04/2026",           // Formato: DD/MM/AAAA
    time: "14:30",                // Formato: HH:MM
    timePeriod: "à tarde",        // Opcional
  };

  // Validar dados
  const validation = validateSchedulingData(schedulingData);
  if (!validation.isValid) {
    console.error("Erro na validação:", validation.errors);
    return;
  }

  // Formatar mensagem
  const message = formatSchedulingMessage(schedulingData);
  console.log("Mensagem:", message);

  // Gerar URL
  const url = generateWhatsAppUrl(schedulingData);
  console.log("URL:", url);

  // Abrir WhatsApp
  await openWhatsAppWithScheduling(schedulingData);
}

// ============================================================================
// EXEMPLO 3: Função Utilitária para Componentes Reutilizáveis
// ============================================================================

import {
  formatDateToSlashFormat,
  getTimePeriodDescription,
} from "@/services/whatsappService";

function exemploFuncoesUtilitarias() {
  // Formatar data
  const dataFormatada = formatDateToSlashFormat("2026-04-22");
  console.log(dataFormatada); // Saída: "22/04/2026"

  // Obter descrição do período
  const periodo1 = getTimePeriodDescription("09:00");
  console.log(periodo1); // Saída: "pela manhã"

  const periodo2 = getTimePeriodDescription("14:30");
  console.log(periodo2); // Saída: "à tarde"

  const periodo3 = getTimePeriodDescription("19:00");
  console.log(periodo3); // Saída: "noturno"
}

// ============================================================================
// EXEMPLO 4: Validação de Dados
// ============================================================================

function exemploValidacao() {
  const { validateSchedulingData } = require("@/services/whatsappService");

  const dadosIncompletos = {
    name: "Jo",                    // Muito curto
    service: "",                   // Vazio
    date: "22/04/2026",
    time: "25:00",                 // Hora inválida
  };

  const resultado = validateSchedulingData(dadosIncompletos);

  console.log("É válido?", resultado.isValid); // false
  console.log("Erros:", resultado.errors);
  // [
  //   "Nome deve ter pelo menos 3 caracteres",
  //   "Serviço é obrigatório",
  //   "Formato de horário inválido"
  // ]
}

// ============================================================================
// ESTRUTURA DO PROJETO
// ============================================================================

/*
src/
├── services/
│   └── whatsappService.ts          ← Serviço principal de integração
├── hooks/
│   └── useScheduling.ts            ← Hook customizado para uso em componentes
├── components/
│   └── BookingSection.tsx          ← Componente de agendamento (já integrado)
└── ...

FUNÇÕES PRINCIPAIS:

1. formatSchedulingMessage(data: SchedulingData): string
   - Formata a mensagem com emojis e estrutura profissional
   - Entrada: Dados do agendamento
   - Saída: Mensagem formatada

2. validateSchedulingData(data: Partial<SchedulingData>): ValidationResult
   - Valida todos os campos
   - Retorna erros de validação

3. generateWhatsAppUrl(data: SchedulingData): string
   - Gera URL do WhatsApp com mensagem codificada
   - Lança erro se dados forem inválidos

4. openWhatsAppWithScheduling(data: SchedulingData): Promise<void>
   - Abre WhatsApp em nova aba
   - Função recomendada para usar

5. getTimePeriodDescription(time: string): string
   - Retorna descrição do período (manhã, tarde, noturno)

6. formatDateToSlashFormat(dateStr: string): string
   - Converte YYYY-MM-DD para DD/MM/AAAA

HOOK (useScheduling):

Retorna:
- sendScheduling(): Função para enviar agendamento
- isLoading: Boolean para estado de carregamento
- error: String com mensagem de erro
- clearError(): Função para limpar erro
- lastValidation: Resultado da última validação
*/

// ============================================================================
// TESTE DA FUNCIONALIDADE
// ============================================================================

/*
Para testar a funcionalidade:

1. Abra o navegador em http://localhost:8080
2. Role até a seção de agendamento
3. Preencha o formulário:
   - Nome: João Silva
   - Serviço: Aplicação natural
   - Data: 25/04/2026 (qualquer data futura)
   - Horário: 10:00 (qualquer horário disponível)
4. Clique em "Confirmar Agendamento"
5. O WhatsApp Web deve abrir em nova aba com mensagem pré-preenchida
6. Clique em "Enviar" para completar o agendamento

TESTE DE VALIDAÇÃO:
- Deixe campos vazios: deve exibir erro
- Digite nome com menos de 3 caracteres: deve avisar
- Digite horário inválido: deve validar

TESTE DE PERÍODO:
- Manhã (7-11): deve indicar "pela manhã"
- Tarde (12-17): deve indicar "à tarde"
- Noite (18+): deve indicar "noturno"
*/

export { ExemploComponenteAgendamento };
