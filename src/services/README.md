# 📱 Funcionalidade de Agendamento via WhatsApp

## 📋 Visão Geral

Sistema completo de integração com WhatsApp para agendamento de serviços de unhas. O usuário preenche um formulário e, ao confirmar, o WhatsApp abre automaticamente com uma mensagem profissional pré-formatada.

## ✨ Características

- ✅ Mensagem formatada com emojis e estrutura profissional
- ✅ Validação completa de dados
- ✅ Suporte a diferentes períodos do dia (manhã, tarde, noturno)
- ✅ Geração automática de URL com mensagem codificada
- ✅ Hook customizado para facilitar uso em componentes
- ✅ Tratamento de erros robusto
- ✅ TypeScript com tipos bem definidos
- ✅ Código modular e reutilizável

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── whatsappService.ts          ← Serviço principal
│   └── EXEMPLO_USO.md              ← Exemplos de uso
├── hooks/
│   └── useScheduling.ts            ← Hook customizado
└── components/
    └── BookingSection.tsx          ← Componente de agendamento
```

## 🚀 Como Usar

### Opção 1: Hook Customizado (Recomendado)

```typescript
import { useScheduling } from "@/hooks/useScheduling";

function MeuComponente() {
  const { sendScheduling, isLoading, error } = useScheduling();

  const handleAgendar = async () => {
    await sendScheduling(
      {
        name: "João Silva",
        service: "Aplicação natural",
      },
      "2026-04-25", // Date input (YYYY-MM-DD)
      "14:30"       // Time input (HH:MM)
    );
  };

  return (
    <button onClick={handleAgendar} disabled={isLoading}>
      {isLoading ? "Enviando..." : "Agendar"}
    </button>
  );
}
```

### Opção 2: Serviço Direto

```typescript
import { openWhatsAppWithScheduling } from "@/services/whatsappService";

const dados = {
  name: "Maria Silva",
  service: "Manutenção",
  date: "22/04/2026",    // DD/MM/AAAA
  time: "10:00",         // HH:MM
  timePeriod: "pela manhã"
};

await openWhatsAppWithScheduling(dados);
```

## 📚 Documentação da API

### `whatsappService.ts`

#### `formatSchedulingMessage(data: SchedulingData): string`
Formata a mensagem com emojis e estrutura profissional.

**Parâmetros:**
- `data`: Dados do agendamento (nome, serviço, data, hora)

**Retorno:** String com a mensagem formatada

**Exemplo:**
```typescript
const msg = formatSchedulingMessage({
  name: "João",
  service: "Aplicação natural",
  date: "22/04/2026",
  time: "14:30",
  timePeriod: "à tarde"
});
```

---

#### `validateSchedulingData(data: Partial<SchedulingData>): ValidationResult`
Valida os dados de agendamento.

**Validações:**
- ✓ Nome: Mínimo 3 caracteres
- ✓ Serviço: Obrigatório
- ✓ Data: Formato DD/MM/AAAA
- ✓ Hora: Formato HH:MM com valores válidos

**Retorno:**
```typescript
{
  isValid: boolean;
  errors: string[];
}
```

**Exemplo:**
```typescript
const resultado = validateSchedulingData({
  name: "Jo",      // ❌ Muito curto
  service: "",     // ❌ Vazio
  date: "invalid", // ❌ Formato inválido
  time: "25:00"    // ❌ Hora inválida
});

console.log(resultado.isValid); // false
console.log(resultado.errors);  // Array com mensagens de erro
```

---

#### `generateWhatsAppUrl(data: SchedulingData): string`
Gera a URL do WhatsApp com mensagem codificada.

**Parâmetros:**
- `data`: Dados validados do agendamento

**Retorno:** URL completa do WhatsApp (https://wa.me/...)

**Lança erro** se dados forem inválidos

**Exemplo:**
```typescript
const url = generateWhatsAppUrl({
  name: "João Silva",
  service: "Aplicação natural",
  date: "22/04/2026",
  time: "14:30"
});

console.log(url);
// https://wa.me/5569993630686?text=Olá%2C%20Perez%21%20...
```

---

#### `openWhatsAppWithScheduling(data: SchedulingData): Promise<void>`
Abre o WhatsApp em nova aba com a mensagem pré-formatada.

**Função recomendada para usar em componentes.**

**Parâmetros:**
- `data`: Dados do agendamento

**Lança erro** se:
- Dados forem inválidos
- Não conseguir abrir nova aba

**Exemplo:**
```typescript
try {
  await openWhatsAppWithScheduling(dados);
  console.log("WhatsApp aberto!");
} catch (error) {
  console.error("Erro:", error.message);
}
```

---

#### `getTimePeriodDescription(time: string): string`
Retorna a descrição do período baseado na hora.

**Parâmetros:**
- `time`: Hora em formato HH:MM

**Retorno:** String descritiva
- "pela manhã" (00:00-11:59)
- "à tarde" (12:00-17:59)
- "noturno" (18:00-23:59)

**Exemplo:**
```typescript
getTimePeriodDescription("09:00")  // "pela manhã"
getTimePeriodDescription("14:30")  // "à tarde"
getTimePeriodDescription("20:00")  // "noturno"
```

---

#### `formatDateToSlashFormat(dateStr: string): string`
Converte data do input type="date" para formato DD/MM/AAAA.

**Parâmetros:**
- `dateStr`: Data em formato YYYY-MM-DD

**Retorno:** Data em formato DD/MM/AAAA ou string vazia se inválida

**Exemplo:**
```typescript
formatDateToSlashFormat("2026-04-22")  // "22/04/2026"
```

---

### `useScheduling.ts`

Hook customizado para gerenciar agendamento via WhatsApp.

**Retorno:**

```typescript
{
  sendScheduling: (
    data: Omit<SchedulingData, "date" | "timePeriod">,
    dateStr: string,  // YYYY-MM-DD
    timeStr: string   // HH:MM
  ) => Promise<void>;
  
  isLoading: boolean;           // Indicador de carregamento
  error: string | null;         // Mensagem de erro
  clearError: () => void;       // Limpar erro
  lastValidation: ValidationResult | null;
}
```

**Exemplo completo:**
```typescript
const { sendScheduling, isLoading, error, clearError } = useScheduling();

const handleSubmit = async () => {
  clearError();
  try {
    await sendScheduling(
      { name: "João", service: "Aplicação" },
      "2026-04-25",
      "14:30"
    );
  } catch (err) {
    console.error("Erro:", error);
  }
};
```

---

## 📱 Formato da Mensagem

A mensagem é automaticamente formatada assim:

```
Olá, Perez! 👋

Espero que esteja tudo bem com você! ✨

Venho pelo site do estúdio para solicitar um agendamento. Seguem os dados:

📋 *Informações do Agendamento:*
🎨 Serviço: Aplicação natural
📅 Data: 22/04/2026
⏰ Horário: 14:30 (à tarde)

👤 *Dados do Cliente:*
📝 Nome: João Silva

Fico no aguardo da sua confirmação. Agradeço imensamente pela atenção 
e pelo cuidado de sempre! 🙏

Obrigado pela preferência! Em breve entraremos em contato para confirmar 
seu horário.

Um grande abraço! 💅
```

## 🔐 Segurança

- ✅ Validação de todos os campos
- ✅ Sanitização de caracteres especiais via `encodeURIComponent`
- ✅ Tratamento de erros robusto
- ✅ Número do WhatsApp centralizado em variável

## 🧪 Testes

Para testar a funcionalidade:

1. **Abra o site** em http://localhost:8080
2. **Role até a seção de Agendamento**
3. **Preencha o formulário:**
   - Nome: `João Silva`
   - Serviço: `Aplicação natural`
   - Data: Qualquer data futura
   - Horário: Qualquer horário disponível

4. **Clique em "Confirmar Agendamento"**
5. **WhatsApp Web deve abrir** em nova aba
6. **A mensagem estará pronta para envio**

### Testes de Validação

- [ ] Deixar nome vazio → deve exibir erro
- [ ] Digite nome com 2 caracteres → deve avisar
- [ ] Deixar serviço vazio → deve exibir erro
- [ ] Deixar data vazia → deve exibir erro
- [ ] Deixar hora vazia → deve exibir erro

### Testes de Período

- [ ] Hora 07:00 → deve indicar "pela manhã"
- [ ] Hora 14:30 → deve indicar "à tarde"
- [ ] Hora 19:00 → deve indicar "noturno"

## 🔧 Configuração

### Mudar o número do WhatsApp

No arquivo [whatsappService.ts](./whatsappService.ts):

```typescript
const WHATSAPP_NUMBER = "5569993630686"; // ← Altere este número
```

**Formato:** Código do país + DDD + Número (sem formatação)

**Exemplos:**
- Brasil: `55` + `69` + `99363-0686` = `5569993630686`
- Outro país: Ajuste conforme necessário

## 📝 Tipos TypeScript

```typescript
// Dados do agendamento
interface SchedulingData {
  name: string;
  service: string;
  date: string;        // DD/MM/AAAA
  time: string;        // HH:MM
  timePeriod?: string; // Opcional
}

// Resultado de validação
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

## 🎯 Fluxo Completo

```
1. Usuário preenche formulário
   ↓
2. Validação de campos
   ↓
3. Se válido:
   - Formata mensagem com emojis
   - Gera URL com encodeURIComponent
   - Abre WhatsApp em nova aba
   ↓
4. Se inválido:
   - Exibe mensagens de erro
   - Destaca campos com erro
```

## 🚨 Tratamento de Erros

```typescript
try {
  await openWhatsAppWithScheduling(dados);
} catch (error) {
  // Erros possíveis:
  // - "Dados inválidos: ..."
  // - "Erro ao abrir WhatsApp: ..."
  console.error(error.message);
}
```

## 📦 Dependências

- React 18+
- TypeScript 4.5+
- lucide-react (para ícones)

## ✅ Checklist de Implementação

- [x] Serviço WhatsApp criado
- [x] Hook customizado criado
- [x] Componente BookingSection integrado
- [x] Validações implementadas
- [x] Mensagem formatada profissional
- [x] Tratamento de erros
- [x] Tipos TypeScript completos
- [x] Documentação e exemplos
- [x] Suporte a diferentes períodos do dia

## 🎨 Customizações Futuras

- [ ] Suporte a múltiplos números de WhatsApp
- [ ] Agendamento via email também
- [ ] Confirmação de agendamento por SMS
- [ ] Histórico de agendamentos
- [ ] Integração com calendário (Google Calendar)

## 📞 Suporte

Para mais informações ou dúvidas sobre a implementação, consulte:
- [EXEMPLO_USO.md](./EXEMPLO_USO.md) - Exemplos práticos
- Código comentado em [whatsappService.ts](./whatsappService.ts)
- Hook em [useScheduling.ts](../hooks/useScheduling.ts)
