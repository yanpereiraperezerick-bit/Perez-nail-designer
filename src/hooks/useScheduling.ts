/**
 * Hook customizado para gerenciar agendamento via WhatsApp
 * Combina validação, formatação e envio de mensagens
 */

import { useState, useCallback } from "react";
import {
  openWhatsAppWithScheduling,
  validateSchedulingData,
  getTimePeriodDescription,
  formatDateToSlashFormat,
  type SchedulingData,
  type ValidationResult,
} from "@/services/whatsappService";

interface UseSchedulingReturn {
  /** Envia o agendamento para o WhatsApp */
  sendScheduling: (data: Omit<SchedulingData, "date" | "timePeriod">, dateStr: string, timeStr: string) => Promise<void>;
  /** Estado de carregamento */
  isLoading: boolean;
  /** Erro da última tentativa */
  error: string | null;
  /** Limpar erro */
  clearError: () => void;
  /** Último resultado de validação */
  lastValidation: ValidationResult | null;
}

export function useScheduling(): UseSchedulingReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastValidation, setLastValidation] = useState<ValidationResult | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendScheduling = useCallback(
    async (
      data: Omit<SchedulingData, "date" | "timePeriod">,
      dateStr: string,
      timeStr: string
    ): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        // Formatar data e horário
        const formattedDate = formatDateToSlashFormat(dateStr);
        const timePeriod = getTimePeriodDescription(timeStr);

        // Preparar dados completos
        const schedulingData: SchedulingData = {
          ...data,
          date: formattedDate,
          time: timeStr,
          timePeriod,
        };

        // Validar dados
        const validation = validateSchedulingData(schedulingData);
        setLastValidation(validation);

        if (!validation.isValid) {
          setError(validation.errors.join(", "));
          setIsLoading(false);
          return;
        }

        // Enviar para WhatsApp
        await openWhatsAppWithScheduling(schedulingData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao enviar agendamento";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    sendScheduling,
    isLoading,
    error,
    clearError,
    lastValidation,
  };
}
