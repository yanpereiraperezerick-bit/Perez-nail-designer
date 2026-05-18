import { type LucideIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectionOption<T extends string | number> = {
  value: T;
  label: string;
  description?: string;
  icon?: LucideIcon;
};

interface SelectionGroupProps<T extends string | number> {
  title: string;
  options: SelectionOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  hint?: string;
  error?: boolean;
}

const SelectionGroup = <T extends string | number>({
  title,
  options,
  selectedValue,
  onChange,
  hint,
  error,
}: SelectionGroupProps<T>) => (
  <div className="space-y-3">
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-base font-semibold text-secondary-foreground">{title}</h3>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </div>
      {error ? (
        <p className="text-sm font-semibold text-destructive">Selecione uma opção.</p>
      ) : null}
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = option.value === selectedValue;
        return (
          <button
            type="button"
            key={String(option.value)}
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "group flex min-h-[100px] w-full flex-col justify-between rounded-[28px] border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
              isSelected
                ? "border-gold bg-gold/10 shadow-[0_18px_56px_rgba(255,198,68,0.14)]"
                : "border-border bg-dark/80 hover:border-gold/40 hover:bg-white/5"
            )}
          >
            <div className="flex items-start gap-3">
              {Icon ? (
                <span className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-gold">
                  <Icon size={18} />
                </span>
              ) : null}
              <div className="flex-1">
                <p className="font-semibold text-secondary-foreground">{option.label}</p>
                {option.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{option.description}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {isSelected ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
                  <CheckCircle size={16} /> Selecionado
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Toque para selecionar</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export default SelectionGroup;
