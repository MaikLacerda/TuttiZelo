# TuttiZelo — Guia de Acessibilidade Front-End (WCAG 2.1 Nível AA / AAA)

> Este guia estabelece os requisitos técnicos, práticos e arquiteturais de acessibilidade para o front-end do **TuttiZelo**, garantindo que pais, idosos, cuidadores e profissionais com deficiências visuais, motoras, cognitivas ou auditivas naveguem com autonomia total.

---

## 1. Princípios Gerais (POUR)

1. **Perceptível (Perceivable)**: A informação e os componentes da interface devem ser apresentados aos usuários em formas que eles possam perceber.
2. **Operável (Operable)**: Os componentes da interface e a navegação devem ser operáveis via teclado, toque ou tecnologias assistivas.
3. **Compreensível (Understandable)**: A informação e a operação da interface devem ser compreensíveis, com linguagem clara e mensagens de erro contextuais.
4. **Robusto (Robust)**: O conteúdo deve ser robusto o suficiente para ser interpretado de forma confiável por uma ampla variedade de agentes de usuário, incluindo leitores de tela (NVDA, VoiceOver, TalkBack, JAWS).

---

## 2. Padrões de Cores e Contraste Visual (Critério 1.4.3 e 1.4.6)

* **Texto Normal (< 18pt)**: Exige razão mínima de contraste de **4.5:1** (AA) e desejável de **7:1** (AAA).
* **Texto Grande (>= 18pt ou 14pt negrito)**: Exige razão mínima de **3.0:1** (AA).
* **Componentes de UI & Ícones Gráficos**: Exige razão mínima de **3.0:1** contra o fundo circundante.

### Matriz de Conformidade TuttiZelo:
* `#C52828` (Tutti Brand Red) sobre `#FFFFFF`: **4.85:1** ✅ (Aprovado AA)
* `#15803D` (Verde Selo Verificado) sobre `#FFFFFF`: **5.12:1** ✅ (Aprovado AA)
* `#0369A1` (Azul Nível 1) sobre `#FFFFFF`: **5.81:1** ✅ (Aprovado AA)
* `#B45309` (Âmbar Nível 3) sobre `#FFFFFF`: **5.22:1** ✅ (Aprovado AA)
* `#18181B` (Texto Zinc 900) sobre `#FAFAFA`: **15.8:1** ✅ (Aprovado AAA)
* `#52525B` (Texto Zinc 600) sobre `#FAFAFA`: **5.24:1** ✅ (Aprovado AA)

> ⚠️ **Regra Fundamental**: A cor **NUNCA** deve ser o único meio de transmitir informação. Selos de verificação devem sempre conter texto explícito (`"Verificado Nível 2"`) e ícone com `aria-label` associado, não apenas uma bolinha verde solta.

---

## 3. Navegação por Teclado e Foco Visível (Critério 2.4.7)

1. **Indicador de Foco**: Nunca remova o outline com `outline: none` sem fornecer uma alternativa visível e contrastante.
   ```css
   :focus-visible {
     outline: 2px solid #C52828;
     outline-offset: 2px;
   }
   ```
2. **Ordem Lógica do DOM**: A ordem de navegação do foco (tecla `Tab`) deve seguir estritamente o fluxo de leitura visual, sem saltos artificiais causados por posicionamentos absolutos ou `tabindex` positivo. Use `tabindex="0"` apenas quando necessário transformar um elemento nativo não-interativo em focável, ou prefira `<button>` e `<a>`.
3. **Trap de Foco em Modais**: Todo diálogo/modal deve reter o foco dentro de seus limites enquanto estiver aberto e retornar o foco ao botão disparador quando for fechado (`Esc`).

---

## 4. Alvos de Toque no Mobile (Critério 2.5.5)

Para idosos e cuidadores utilizando smartphones (especialmente em campo ou em movimento):
* **Área Mínima de Toque**: Todos os botões interativos, switches, links e chips devem ter no mínimo **44 × 44 pixels** de área clicável (`min-h-[44px] min-w-[44px]`).
* **Espaçamento entre Alvos**: Mínimo de **8px** de separação entre botões adjacentes para evitar cliques acidentais.

---

## 5. Práticas de Código Semântico e ARIA

### 5.1 Botões com Ícones
Botões que exibem apenas ícones visuais (como o botão de fechar modal ou favoritar) **DEVEM** possuir descrição textual acessível:
```tsx
<button
  type="button"
  aria-label="Adicionar aos favoritos"
  className="p-3 rounded-full min-h-[44px] min-w-[44px]"
>
  <HeartIcon aria-hidden="true" className="w-5 h-5 text-[#C52828]" />
</button>
```

### 5.2 Badges de Verificação
```tsx
<div
  role="status"
  aria-label="Perfil com antecedentes criminais e identidade verificados"
  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
>
  <ShieldCheckIcon aria-hidden="true" className="w-4 h-4 text-emerald-700" />
  <span>Verificado Nível 2</span>
</div>
```

### 5.3 Formulários e Mensagens de Erro (Critério 3.3.1 e 3.3.2)
* Todo campo `<input>` deve possuir um `<label>` explicitamente associado via `htmlFor="input-id"` e `id="input-id"`.
* Mensagens de validação devem ser associadas via `aria-describedby="input-error-id"` e ter `aria-invalid={hasError}`.

---

## 6. Suporte a Leitores de Tela e Anúncios Dinâmicos (Live Regions)

Quando o status da verificação mudar (por exemplo, de `submitted` para `approved`), notifique o leitor de tela sem recarregar a página:
```tsx
<div role="status" aria-live="polite" className="sr-only">
  {statusMessage}
</div>
```
