/**
 * Testes para o serviço de WhatsApp
 * Cobre validação, formatação e geração de URLs
 */

import { describe, it, expect } from "vitest";
import {
  formatSchedulingMessage,
  validateSchedulingData,
  generateWhatsAppUrl,
  getTimePeriodDescription,
  formatDateToSlashFormat,
  type SchedulingData,
} from "@/services/whatsappService";

describe("WhatsApp Service", () => {
  // ============================================================
  // TESTES DE VALIDAÇÃO
  // ============================================================

  describe("validateSchedulingData", () => {
    it("deve validar dados completos e válidos", () => {
      const dados: SchedulingData = {
        name: "João Silva",
        service: "Aplicação natural",
        date: "22/04/2026",
        time: "14:30",
      };

      const resultado = validateSchedulingData(dados);

      expect(resultado.isValid).toBe(true);
      expect(resultado.errors).toHaveLength(0);
    });

    it("deve rejeitar nome vazio", () => {
      const resultado = validateSchedulingData({
        name: "",
        service: "Aplicação",
        date: "22/04/2026",
        time: "14:30",
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain("Nome é obrigatório");
    });

    it("deve rejeitar nome com menos de 3 caracteres", () => {
      const resultado = validateSchedulingData({
        name: "Jo",
        service: "Aplicação",
        date: "22/04/2026",
        time: "14:30",
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain(
        "Nome deve ter pelo menos 3 caracteres"
      );
    });

    it("deve rejeitar serviço vazio", () => {
      const resultado = validateSchedulingData({
        name: "João Silva",
        service: "",
        date: "22/04/2026",
        time: "14:30",
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain("Serviço é obrigatório");
    });

    it("deve rejeitar data em formato inválido", () => {
      const resultado = validateSchedulingData({
        name: "João Silva",
        service: "Aplicação",
        date: "2026-04-22", // Formato errado
        time: "14:30",
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain("Formato de data inválido");
    });

    it("deve rejeitar horário em formato inválido", () => {
      const resultado = validateSchedulingData({
        name: "João Silva",
        service: "Aplicação",
        date: "22/04/2026",
        time: "25:00", // Hora inválida
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain("Formato de horário inválido");
    });

    it("deve rejeitar múltiplos dados inválidos", () => {
      const resultado = validateSchedulingData({
        name: "Jo",
        service: "",
        date: "invalid",
        time: "25:00",
      });

      expect(resultado.isValid).toBe(false);
      expect(resultado.errors.length).toBeGreaterThan(1);
    });
  });

  // ============================================================
  // TESTES DE FORMATAÇÃO DE MENSAGEM
  // ============================================================

  describe("formatSchedulingMessage", () => {
    it("deve formatar mensagem com todos os dados", () => {
      const dados: SchedulingData = {
        name: "João Silva",
        service: "Aplicação natural",
        date: "22/04/2026",
        time: "14:30",
        timePeriod: "à tarde",
      };

      const mensagem = formatSchedulingMessage(dados);

      expect(mensagem).toContain("João Silva");
      expect(mensagem).toContain("Aplicação natural");
      expect(mensagem).toContain("R$ 110,00");
      expect(mensagem).toContain("22/04/2026");
      expect(mensagem).toContain("14:30");
      expect(mensagem).toContain("à tarde");
      expect(mensagem).toContain("Olá, Perez!");
      expect(mensagem).toContain("Serviço:");
      expect(mensagem).toContain("Valor:");
      expect(mensagem).toContain("Data:");
      expect(mensagem).toContain("Horário:");
      expect(mensagem).toContain("Nome:");
      expect(mensagem).toContain("Gostaria de agendar um horário");
    });

    it("deve formatar mensagem sem timePeriod", () => {
      const dados: SchedulingData = {
        name: "Maria Santos",
        service: "Manutenção",
        date: "25/04/2026",
        time: "10:00",
      };

      const mensagem = formatSchedulingMessage(dados);

      expect(mensagem).toContain("Maria Santos");
      expect(mensagem).toContain("Manutenção");
      expect(mensagem).not.toContain("undefined");
    });

    it("deve incluir formatação profissional", () => {
      const dados: SchedulingData = {
        name: "Test",
        service: "Test",
        date: "22/04/2026",
        time: "14:30",
      };

      const mensagem = formatSchedulingMessage(dados);

      expect(mensagem).toContain("Serviço:");
      expect(mensagem).toContain("Data:");
      expect(mensagem).toContain("Horário:");
      expect(mensagem).toContain("Nome:");
      expect(mensagem).toContain("Gostaria de agendar um horário");
    });
  });

  // ============================================================
  // TESTES DE GERAÇÃO DE URL
  // ============================================================

  describe("generateWhatsAppUrl", () => {
    it("deve gerar URL válida com dados corretos", () => {
      const dados: SchedulingData = {
        name: "João Silva",
        service: "Aplicação natural",
        date: "22/04/2026",
        time: "14:30",
      };

      const url = generateWhatsAppUrl(dados);

      expect(url).toContain("https://wa.me/");
      expect(url).toContain("5569993630686");
      expect(url).toContain("?text=");
      expect(url).toContain("Jo%C3%A3o%20Silva");
    });

    it("deve codificar a mensagem corretamente", () => {
      const dados: SchedulingData = {
        name: "João Silva",
        service: "Aplicação & Decoração",
        date: "22/04/2026",
        time: "14:30",
      };

      const url = generateWhatsAppUrl(dados);

      // Deve estar codificado
      expect(url).toContain("%20");
      expect(url).toContain("%26");
      expect(url).toContain("%3A");
    });

    it("deve lançar erro com dados inválidos", () => {
      const dados = {
        name: "",
        service: "",
        date: "invalid",
        time: "invalid",
      } as SchedulingData;

      expect(() => generateWhatsAppUrl(dados)).toThrow();
    });
  });

  // ============================================================
  // TESTES DE DESCRIÇÃO DO PERÍODO
  // ============================================================

  describe("getTimePeriodDescription", () => {
    it("deve retornar 'pela manhã' para horas matutinas", () => {
      expect(getTimePeriodDescription("07:00")).toBe("pela manhã");
      expect(getTimePeriodDescription("09:30")).toBe("pela manhã");
      expect(getTimePeriodDescription("11:59")).toBe("pela manhã");
    });

    it("deve retornar 'à tarde' para horas vespertinas", () => {
      expect(getTimePeriodDescription("12:00")).toBe("à tarde");
      expect(getTimePeriodDescription("14:30")).toBe("à tarde");
      expect(getTimePeriodDescription("17:59")).toBe("à tarde");
    });

    it("deve retornar 'noturno' para horas noturnas", () => {
      expect(getTimePeriodDescription("18:00")).toBe("noturno");
      expect(getTimePeriodDescription("20:00")).toBe("noturno");
      expect(getTimePeriodDescription("23:59")).toBe("noturno");
    });

    it("deve retornar 'pela manhã' para meia-noite", () => {
      expect(getTimePeriodDescription("00:00")).toBe("pela manhã");
    });
  });

  // ============================================================
  // TESTES DE FORMATAÇÃO DE DATA
  // ============================================================

  describe("formatDateToSlashFormat", () => {
    it("deve converter data YYYY-MM-DD para DD/MM/AAAA", () => {
      expect(formatDateToSlashFormat("2026-04-22")).toBe("22/04/2026");
      expect(formatDateToSlashFormat("2026-12-25")).toBe("25/12/2026");
      expect(formatDateToSlashFormat("2026-01-01")).toBe("01/01/2026");
    });

    it("deve retornar string vazia para entrada vazia", () => {
      expect(formatDateToSlashFormat("")).toBe("");
    });

    it("deve retornar string vazia para formato inválido", () => {
      expect(formatDateToSlashFormat("invalid")).toBe("");
      expect(formatDateToSlashFormat("22/04/2026")).toBe("");
    });
  });

  // ============================================================
  // TESTES DE INTEGRAÇÃO
  // ============================================================

  describe("Fluxo Completo", () => {
    it("deve validar, formatar e gerar URL com sucesso", () => {
      const dados: SchedulingData = {
        name: "João Silva",
        service: "Aplicação natural",
        date: "22/04/2026",
        time: "14:30",
        timePeriod: "à tarde",
      };

      // 1. Validar
      const validacao = validateSchedulingData(dados);
      expect(validacao.isValid).toBe(true);

      // 2. Formatar
      const mensagem = formatSchedulingMessage(dados);
      expect(mensagem).toContain("João Silva");

      // 3. Gerar URL
      const url = generateWhatsAppUrl(dados);
      expect(url).toContain("https://wa.me/");
      expect(url).toContain("5569993630686");

      // 4. Verificar que tudo está na URL
      expect(url).toContain("Jo%C3%A3o%20Silva");
      expect(url).toContain("Aplica%C3%A7%C3%A3o%20natural");
    });
  });
});
