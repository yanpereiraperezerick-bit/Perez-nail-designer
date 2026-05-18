import { useMemo, useState, type FormEvent } from "react";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { User, Scissors, Sparkles, Shield, RefreshCw, Droplet, Plus, Heart, AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScheduling } from "@/hooks/useScheduling";
import { formatDateToSlashFormat, getTimePeriodDescription } from "@/services/whatsappService";

const serviceOptions = [
  {
    value: "Aplicação natural",
    label: "Aplicação natural",
    description: "Cutilagem e esmaltação inclusas",
    price: "R$ 100,00",
    icon: Scissors,
  },
  {
    value: "Aplicação encapsulada",
    label: "Aplicação encapsulada",
    description: "Decoração e acabamento premium",
    price: "R$ 120,00",
    icon: Sparkles,
  },
  {
    value: "Manutenção natural",
    label: "Manutenção natural",
    description: "Recarga suave e proteção extra",
    price: "R$ 80,00",
    icon: RefreshCw,
  },
  {
    value: "Manutenção esmaltada",
    label: "Manutenção esmaltada",
    description: "Retoca o esmalte com acabamento elegante",
    price: "R$ 90,00",
    icon: Droplet,
  },
  {
    value: "Manutenção encapsulada",
    label: "Manutenção encapsulada",
    description: "Manutenção de unhas encapsuladas",
    price: "R$ 100,00",
    icon: Shield,
  },
  {
    value: "Blindagem",
    label: "Blindagem",
    description: "Proteção extra com brilho duradouro",
    price: "R$ 80,00",
    icon: Shield,
  },
  {
    value: "Reposição de unha",
    label: "Reposição de unha",
    description: "Acerto rápido de unhas quebradas",
    price: "R$ 10,00",
    icon: Plus,
  },
  {
    value: "Remoção total",
    label: "Remoção total",
    description: "Retira todo o serviço anterior com cuidado",
    price: "R$ 35,00",
    icon: RefreshCw,
  },
  {
    value: "Troca de formato",
    label: "Troca de formato",
    description: "Novo estilo de unha na mesma visita",
    price: "R$ 15,00",
    icon: Sparkles,
  },
  {
    value: "Decoração",
    label: "Decoração",
    description: "Detalhes artísticos exclusivos",
    price: "Consultar",
    icon: Heart,
  },
];

/** Horários da manhã (segunda a quinta). */
const MORNING_SLOTS = ["07:00", "10:00"];

/** Horários da tarde (segunda a quinta). */
const AFTERNOON_SLOTS = ["13:00", "16:00"];

/** Horários da sexta-feira. */
const FRIDAY_SLOTS = ["07:00"];

/** Horários de sábado: período estendido (dia todo). */
const FULL_DAY_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 7; h <= 18; h += 1) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
})();

/** YYYY-MM-DD no fuso local (para `<input type="date">`). */
function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseLocalDateFromInput(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getWeekdayFromDateInput(dateStr: string): number | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map((x) => parseInt(x, 10));
  const [y, m, day] = parts;
  if (!y || !m || !day) return null;
  // Data local explícita — evita bug em que YYYY-MM-DD + ISO string muda o dia (fuso) e some a tarde
  return new Date(y, m - 1, day).getDay();
}

/** Grupos para o <select>: tarde aparece em bloco separado (optgroup). */
function getSlotGroupsForWeekday(day: number): { label: string; slots: string[] }[] {
  if (day >= 1 && day <= 4) {
    return [
      { label: "Manhã", slots: MORNING_SLOTS },
      { label: "Tarde", slots: AFTERNOON_SLOTS },
    ];
  }
  if (day === 5) return [{ label: "Manhã", slots: FRIDAY_SLOTS }];
  if (day === 6) {
    const morning = FULL_DAY_SLOTS.filter((t) => parseInt(t.slice(0, 2), 10) < 12);
    const afternoon = FULL_DAY_SLOTS.filter((t) => parseInt(t.slice(0, 2), 10) >= 12);
    return [
      { label: "Manhã", slots: morning },
      { label: "Tarde", slots: afternoon },
    ];
  }
  return [];
}

function getSlotGroupsForDateString(dateStr: string): { label: string; slots: string[] }[] {
  const wd = getWeekdayFromDateInput(dateStr);
  if (wd === null) return [];
  return getSlotGroupsForWeekday(wd);
}

const WHATSAPP_NUMBER = "5569993630686";

const scheduleBlocks = [
  {
    id: "seg-qui",
    daysLine: "Segunda / Terça / Quarta / Quinta",
    detail: "7h e 10h · 13h e 16h",
  },
  {
    id: "sex",
    daysLine: "Sexta-feira",
    detail: "7h",
  },
  {
    id: "sab",
    daysLine: "Sábado",
    detail: "Dia todo · 7h às 18h",
  },
] as const;

const BookingSection = () => {
  const [form, setForm] = useState(() => ({
    service: "",
    date: toDateInputValue(new Date()),
    time: "",
    name: "",
  }));
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { sendScheduling, isLoading, error: submissionError, clearError } = useScheduling();

  const slotGroups = useMemo(() => getSlotGroupsForDateString(form.date), [form.date]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    const newErrors: Record<string, boolean> = {};
    if (!form.service) newErrors.service = true;
    if (!form.date) newErrors.date = true;
    if (!form.time) newErrors.time = true;
    if (!form.name.trim()) newErrors.name = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await sendScheduling(
        {
          name: form.name,
          service: form.service,
        },
        form.date,
        form.time
      );
    } catch (err) {
      console.error("Erro ao enviar agendamento:", err);
    }
  };

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: false }));
  };

  const inputClass = (field: string, opts?: { solidDark?: boolean }) =>
    `w-full ${opts?.solidDark ? "bg-dark [color-scheme:dark]" : "bg-transparent"} border ${
      errors[field] ? "border-destructive" : "border-gold/30"
    } font-body text-secondary-foreground text-sm sm:text-base px-4 py-3 focus:border-gold focus:outline-none transition-colors appearance-none`;

  return (
    <section id="agendamento" className="scroll-mt-28 md:scroll-mt-32 overflow-x-clip bg-dark py-16 md:py-32">
      <div className="container mx-auto max-w-5xl px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-secondary-foreground mb-4"
        >
          <span className="text-gold italic">Agendamento</span>
        </motion.h2>
        <div className="mx-auto mb-8 h-px w-16 bg-gold md:mb-12" />

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start md:gap-8 lg:gap-10 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-w-0 md:sticky md:top-28"
          >
            <h3 className="font-display mb-3 text-center text-lg text-gold sm:text-xl md:text-left">
              Horários de atendimento
            </h3>
            <p className="mb-5 text-center font-body text-sm leading-relaxed text-secondary-foreground sm:text-base md:text-left">
              O atendimento ocorre <strong className="font-semibold text-secondary-foreground">somente</strong> nos dias e
              períodos abaixo. Ao escolher a data no formulário ao lado, os horários disponíveis mudam conforme o dia da
              semana.
            </p>
            <div
              className="overflow-hidden rounded-sm border border-gold/20"
              role="list"
              aria-label="Horários por dia da semana"
            >
              {scheduleBlocks.map((block, index) => (
                <div
                  key={block.id}
                  role="listitem"
                  className={`px-4 py-3.5 sm:px-5 sm:py-4 ${
                    index > 0 ? "border-t border-gold/15" : ""
                  }`}
                >
                  <p className="mb-2 font-body text-[11px] uppercase tracking-[0.18em] text-gold sm:text-xs">
                    {block.daysLine}
                  </p>
                  <p className="font-body text-sm leading-relaxed text-secondary-foreground/95">{block.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="min-w-0 space-y-6"
          >
            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-secondary-foreground">Seleção de serviço</h3>
                </div>
                {errors.service ? (
                  <p className="text-sm font-semibold text-destructive">Selecione uma opção.</p>
                ) : null}
              </div>
              <select
                value={form.service}
                onChange={(e) => update("service", e.target.value)}
                className={inputClass("service")}
              >
                <option value="">Selecione um serviço</option>
                {serviceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-secondary-foreground">Selecione a data</h3>
                </div>
                {errors.date ? (
                  <p className="text-sm font-semibold text-destructive">Por favor, selecione uma data.</p>
                ) : null}
              </div>
              <input
                type="date"
                min={toDateInputValue(new Date())}
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={inputClass("date")}
              />
            </div>

            <div className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-secondary-foreground">Horário</h3>
                </div>
                {errors.time ? (
                  <p className="text-sm font-semibold text-destructive">Por favor, escolha um horário.</p>
                ) : null}
              </div>
              <select
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                className={inputClass("time")}
              >
                <option value="">Selecione um horário</option>
                {slotGroups.length > 0 ? (
                  slotGroups.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.slots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </optgroup>
                  ))
                ) : (
                  <option value="" disabled>
                    Escolha uma data válida primeiro
                  </option>
                )}
              </select>
            </div>

          {/* Name */}
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50" />
            <input
              type="text"
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={`${inputClass("name")} pl-10 placeholder:text-secondary-foreground/30`}
            />
          </div>
          {errors.name && (
            <p className="text-destructive text-xs font-body">Por favor, informe seu nome.</p>
          )}

          {submissionError && (
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/30 p-3">
              <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-xs font-body">{submissionError}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full border-2 border-gold text-gold py-3 sm:py-4 font-body text-xs sm:text-sm uppercase tracking-[0.2em] hover:bg-gold hover:text-dark transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Enviando..." : "Confirmar Agendamento"}
          </button>
        </motion.form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
