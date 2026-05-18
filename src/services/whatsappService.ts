/**
 * Serviço de integração com WhatsApp
 * Responsável por montar mensagens formatadas e gerar URLs para envio
 */

/** Dados do agendamento */
export interface SchedulingData {
  name: string;
  service: string;
  date: string; // Formato: DD/MM/AAAA
  time: string; // Formato: HH:MM
  timePeriod?: string; // Descrição do período (ex: "pela manhã")
}

/** Resposta de validação */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/** Número do WhatsApp da empresária (formato internacional) */
const WHATSAPP_NUMBER = "5569993630686";

/** Mapeamento de serviços para preços */
const SERVICE_PRICES: Record<string, string> = {
  "Aplicação natural": "R$ 100,00",
  "Aplicação encapsulada": "R$ 120,00",
  "Manutenção natural": "R$ 80,00",
  "Manutenção esmaltada": "R$ 90,00",
  "Manutenção encapsulada": "R$ 100,00",
  "Blindagem": "R$ 80,00",
  "Reposição de unha": "R$ 10,00",
  "Remoção total": "R$ 35,00",
  "Troca de formato": "R$ 15,00",
  "Decoração": "Consultar",
};

/**
 * Obtém o preço de um serviço
 * @param service Nome do serviço
 * @returns Preço do serviço ou "Consultar" se não encontrado
 */
function getServicePrice(service: string): string {
  return SERVICE_PRICES[service] || "Consultar";
}

/**
 * Formata a mensagem de agendamento com os dados fornecidos
 * @param data Dados do agendamento
 * @returns Mensagem formatada
 */
export function formatSchedulingMessage(data: SchedulingData): string {
  const { name, service, date, time, timePeriod = "" } = data;
  
  const price = getServicePrice(service);
  
  const message = `Olá, Perez!

Gostaria de agendar um horário:

Serviço: ${service}
Valor: ${price}
Data: ${date}
Horário: ${time}${timePeriod ? ` (${timePeriod})` : ""}

Nome: ${name}`;
  
  return message;
}
/**
 * Valida os dados de agendamento
 * @param data Dados a validar
 * @returns Resultado da validação com array de erros
 */
export function validateSchedulingData(data: Partial<SchedulingData>): ValidationResult {
  const errors: string[] = [];

  // Validar nome
  if (!data.name || !data.name.trim()) {
    errors.push("Nome é obrigatório");
  } else if (data.name.trim().length < 3) {
    errors.push("Nome deve ter pelo menos 3 caracteres");
  }

  // Validar serviço
  if (!data.service || !data.service.trim()) {
    errors.push("Serviço é obrigatório");
  }

  // Validar data
  if (!data.date) {
    errors.push("Data é obrigatória");
  } else if (!isValidDateFormat(data.date)) {
    errors.push("Formato de data inválido");
  }

  // Validar horário
  if (!data.time || !data.time.trim()) {
    errors.push("Horário é obrigatório");
  } else if (!isValidTimeFormat(data.time)) {
    errors.push("Formato de horário inválido");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Valida o formato de data (DD/MM/AAAA)
 * @param date Data em formato DD/MM/AAAA
 * @returns true se válido
 */
function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
}

/**
 * Valida o formato de horário (HH:MM)
 * @param time Horário em formato HH:MM
 * @returns true se válido
 */
function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) return false;

  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

/**
 * Gera a URL do WhatsApp com mensagem pré-formatada
 * @param data Dados do agendamento
 * @returns URL para abrir no WhatsApp
 */
export function generateWhatsAppUrl(data: SchedulingData): string {
  // Validar dados
  const validation = validateSchedulingData(data);
  if (!validation.isValid) {
    throw new Error(`Dados inválidos: ${validation.errors.join(", ")}`);
  }

  // Formatar mensagem
  const message = formatSchedulingMessage(data);

  // Codificar mensagem e gerar URL
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

  return url;
}

/**
 * Abre o WhatsApp com a mensagem de agendamento
 * @param data Dados do agendamento
 * @returns Promise que resolve quando a janela é aberta
 */
export async function openWhatsAppWithScheduling(data: SchedulingData): Promise<void> {
  try {
    const url = generateWhatsAppUrl(data);
    window.open(url, "_blank");
  } catch (error) {
    throw new Error(`Erro ao abrir WhatsApp: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
  }
}

/**
 * Calcula a descrição do período baseado na hora
 * @param time Horário em formato HH:MM
 * @returns Descrição do período (ex: "pela manhã", "à tarde")
 */
export function getTimePeriodDescription(time: string): string {
  const hours = parseInt(time.split(":")[0] ?? "0", 10);

  if (hours >= 0 && hours < 12) {
    return "pela manhã";
  } else if (hours >= 12 && hours < 18) {
    return "à tarde";
  } else {
    return "noturno";
  }
}

/**
 * Formata uma data do input type="date" para o formato DD/MM/AAAA
 * @param dateStr Data em formato YYYY-MM-DD
 * @returns Data em formato DD/MM/AAAA
 */
export function formatDateToSlashFormat(dateStr: string): string {
  if (!dateStr) return "";

  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";

  const [year, month, day] = parts;
  if (isNaN(Number(year)) || isNaN(Number(month)) || isNaN(Number(day))) return "";

  return `${day}/${month}/${year}`;
}

/**
 * Converte data do input para objeto Date
 * @param dateStr Data em formato YYYY-MM-DD
 * @returns Data ou undefined se inválida
 */
export function parseLocalDateFromInput(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;

  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return undefined;

  return new Date(y, m - 1, d);
}
