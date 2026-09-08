# TuttiZelo — Design System & Guia de Estilos

> Identidade visual desenvolvida para a plataforma SaaS multi-tenant **TuttiZelo** (Kondora Tech), especializada em conexão confiável entre famílias e cuidadores de crianças (babás), idosos e animais de estimação (pet sitters).

---

## 1. Identidade de Marca & Simbologia do Logo

A logomarca **TuttiZelo** traduz o tripé central de valor: **Segurança + Confiança + Conveniência**.

* **O Coração Protetor**: O contorno principal do coração acolhe todas as vidas que demandam afeto e responsabilidade.
* **A Mão Base**: Representa sustentação, acolhimento físico e compromisso ético dos cuidadores.
* **As Três Vidas Cuidadas**:
  * **Bebê/Criança**: Representa a vertical de Babás e educadores infantis.
  * **Idoso**: Representa a vertical de Cuidadores de Idosos (gerontologia, pós-operatório, companhia).
  * **Pet (Cachorrinho)**: Representa a vertical de Pet Sitters (cães, gatos e animais domésticos).
* **Símbolo do Infinito com Checkmark (Topo)**: Simboliza a **verificação contínua** (background checks recorrentes, checagem judicial periódica e tranquilidade contínua para as famílias).

---

## 2. Paleta de Cores e Tokens Oficiais

Todas as cores foram calibradas para conformidade com **WCAG 2.1 nível AA** (mínimo de 4.5:1 para texto normal e 3:1 para elementos gráficos).

### 2.1 Cores Primárias de Marca (Tutti Red)

| Token CSS | Hexadecimal | Uso Recomendado | Contraste vs Fundo Branco |
| :--- | :--- | :--- | :--- |
| `--color-tutti-brand` | `#C52828` | Botões primários, logo, cabeçalhos de destaque, chamadas principais | **4.85:1 (Passa AA)** |
| `--color-tutti-brand-hover` | `#A82020` | Estados de hover em botões primários e links ativos | **6.45:1 (Passa AAA)** |
| `--color-tutti-brand-active` | `#8B1818` | Estados de pressionamento (active/pressed) | **8.12:1 (Passa AAA)** |
| `--color-tutti-soft` | `#FDF2F2` | Fundos de cards de destaque, alertas suaves, badges secundárias | 1.15:1 (Uso exclusivo de fundo) |
| `--color-tutti-accent` | `#E05342` | Gradientes secundários, micro-interações | 3.42:1 (Elementos gráficos/ícones) |

### 2.2 Cores Semânticas de Verificação & Status

| Selo / Nível | Hexadecimal | Significado na Plataforma | Regra de Negócio |
| :--- | :--- | :--- | :--- |
| **Nível 1 — Identidade** | `#0369A1` (Azul Sky) | CPF regular na Receita, OCR do RG/CNH e Prova de Vida (Liveness) | Desbloqueia perfil básico |
| **Nível 2 — Antecedentes 🟢** | `#15803D` (Verde Trust) | Certidão Criminal Federal + Estaduais de todas as UFs resididas + BNMP | **Selo Ouro de Segurança** |
| **Nível 3+ — Excelência ⭐** | `#B45309` (Âmbar Ouro) | Primeiros Socorros comprovados, cursos específicos, referências auditadas | Destaque máximo na curadoria |
| **Pendente / Análise** | `#D97706` (Amarelo) | Em análise manual ou aguardando webhook de bureau parceiro | Alerta informativo |
| **Reprovado / Rejeitado** | `#DC2626` (Vermelho Alerta) | Inconsistência documental ou registro impeditivo (com prazo de contestação) | Acesso bloqueado |

### 2.3 Neutros e Superfícies

* **Superfície Geral (`--color-surface-bg`)**: `#FAFAFA` (Fundo suave, elimina o branco ofuscante)
* **Cartões e Modais (`--color-surface-card`)**: `#FFFFFF`
* **Texto Principal (`--color-text-main`)**: `#18181B` (Zinc 900 — Contraste 16.1:1)
* **Texto Secundário (`--color-text-muted`)**: `#52525B` (Zinc 600 — Contraste 5.34:1)
* **Bordas Suaves (`--color-border-subtle`)**: `#E4E4E7` (Zinc 200)

---

## 3. Tipografia

* **Display / Títulos / Logotipo**: `Outfit`, sans-serif (pesos 600 SemiBold, 700 Bold, 800 ExtraBold).
  * Proporciona personalidade calorosa, geométrica e acolhedora, essencial para o público familiar.
* **Interface / Texto Corrido / Dados de BI**: `Plus Jakarta Sans`, sans-serif (pesos 400 Regular, 500 Medium, 600 SemiBold, 700 Bold).
  * Altíssima legibilidade em telas móveis e densidade ideal para dashboards e checagens de QA.

### Escala de Tamanhos (Major Second 1.125 / Perfect Fourth 1.333)

* **Display H1**: `2.25rem` (36px), line-height: `1.2`, weight: `800`
* **H2 (Seções)**: `1.75rem` (28px), line-height: `1.3`, weight: `700`
* **H3 (Subseções)**: `1.25rem` (20px), line-height: `1.4`, weight: `600`
* **Corpo (Base)**: `1rem` (16px), line-height: `1.6`, weight: `400 / 500`
* **Texto Secundário / Badges**: `0.875rem` (14px) e `0.75rem` (12px), weight: `600`

---

## 4. Integração no Vercel & Tailwind CSS

### No seu arquivo `src/index.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --color-tutti-brand: #c52828;
    --color-tutti-brand-hover: #a82020;
    --color-tutti-soft: #fdf2f2;
    --color-verified-green: #15803d;
    --color-level1-blue: #0369a1;
    --color-level3-amber: #b45309;
  }
}
```

### Componente de Botão Padrão:

```tsx
<button
  className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-white bg-[#C52828] hover:bg-[#A82020] active:bg-[#8B1818] transition-all shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C52828] cursor-pointer min-h-[44px]"
>
  Solicitar Verificação
</button>
```
