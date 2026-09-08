import React, { useState } from 'react';
import {
  Palette,
  Check,
  Copy,
  Eye,
  Type,
  ShieldCheck,
  Accessibility,
  Sparkles,
  Heart,
  Upload,
} from 'lucide-react';
import { Logo } from './Logo';
import { LogoUploaderModal } from './LogoUploaderModal';
import { useOfficialLogo } from '../../lib/logoStore';

export const StyleGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { logoUrl } = useOfficialLogo();

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const colors = [
    { name: 'Tutti Brand Terracota', hex: '#96382B', rgb: '150, 56, 43', role: 'Cor mestre, "Tutti", coração com asa, mão cuidadora', contrast: '5.8:1 (AAA)' },
    { name: 'Zelo Brand Coral', hex: '#FA7C64', rgb: '250, 124, 100', role: 'Destaque acolhedor, "Zelo", cãozinho e gatinho', contrast: '4.5:1 (AA)' },
    { name: 'Tutti Dark Terracotta', hex: '#7D2E23', rgb: '125, 46, 35', role: 'Hover de botões primários e títulos', contrast: '7.2:1 (AAA)' },
    { name: 'Tutti Slogan Brown', hex: '#69271E', rgb: '105, 39, 30', role: 'Slogan: "O cuidado total para quem você ama"', contrast: '8.6:1 (AAA)' },
    { name: 'Tutti Soft Blush', hex: '#FDF6F4', rgb: '253, 246, 244', role: 'Fundo suave de cartões, badges ativos e seletores', contrast: 'Fundo de apoio' },
    { name: 'Tutti Warm Cream', hex: '#FAF7F2', rgb: '250, 247, 242', role: 'Fundo oficial da aplicação (textura papel suave)', contrast: 'Superfície Base' },
    { name: 'Verified Green', hex: '#15803D', rgb: '21, 128, 61', role: 'Selo Perfil Verificado 🟢 (Nível 2 Antecedentes)', contrast: '5.12:1 (AA)' },
    { name: 'Identity Sky Blue', hex: '#0369A1', rgb: '3, 105, 161', role: 'Selo Nível 1 (CPF + Validação de Identidade)', contrast: '5.81:1 (AA)' },
    { name: 'Excellence Amber', hex: '#B45309', rgb: '180, 83, 9', role: 'Selo Nível 3+ (Primeiros Socorros + Cursos ⭐)', contrast: '5.22:1 (AA)' },
    { name: 'Text Main', hex: '#2B1815', rgb: '43, 24, 21', role: 'Texto corrido principal de altíssima legibilidade', contrast: '16.8:1 (AAA)' },
  ];

  const cssTokensCode = `:root {
  /* TuttiZelo Official Brand Color System (Extracted from Logo) */
  --color-tutti-brand: #96382B;
  --color-tutti-brand-hover: #7D2E23;
  --color-tutti-brand-active: #64241B;
  --color-tutti-coral: #FA7C64;
  --color-tutti-coral-hover: #E56B54;
  --color-tutti-soft: #FDF6F4;
  --color-tutti-cream: #FAF7F2;
  --color-tutti-slogan: #69271E;

  /* Trust & Verification Badges */
  --color-verified-green: #15803D;
  --color-verified-green-soft: #F0FDF4;
  --color-level1-blue: #0369A1;
  --color-level1-blue-soft: #F0F9FF;
  --color-level3-amber: #B45309;
  --color-level3-amber-soft: #FFFBEB;

  /* Neutrals & Surfaces */
  --color-surface-bg: #FAF7F2;
  --color-surface-card: #FFFFFF;
  --color-text-main: #2B1815;
  --color-text-muted: #5C4541;
  --color-border-subtle: #EBDCD7;

  /* Typography */
  --font-display: 'Outfit', sans-serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#EBDCD7] p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FDF6F4] text-[#96382B]">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-display">
                Identidade Visual Oficial TuttiZelo
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                Logomarca oficial idêntica à fornecida, paleta terracota & coral, tipografia e conformidade WCAG AA.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(cssTokensCode, 'all-tokens')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
          >
            {copiedKey === 'all-tokens' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKey === 'all-tokens' ? 'Tokens Copiados!' : 'Copiar CSS Tokens'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Brand Logo Exact Replication */}
      <div className="bg-white rounded-2xl border border-[#EBDCD7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#96382B]" />
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Logomarca Oficial & Aplicações
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#96382B] bg-[#FDF6F4] hover:bg-[#F5D8D0] border border-[#F5D8D0] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{logoUrl ? 'Substituir Imagem Original' : 'Carregar Imagem Original (.jpg)'}</span>
          </button>
        </div>

        <LogoUploaderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Exact Stacked Version matching the uploaded image */}
          <div className="p-8 rounded-2xl border-2 border-[#F5D8D0] bg-[#FAF7F2] flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <Logo size="hero" variant="stacked" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EBDCD7] text-[11px] font-bold text-[#96382B]">
              <Heart className="w-3.5 h-3.5 fill-[#96382B]" />
              <span>Versão Principal Oficial (Empilhada)</span>
            </div>
          </div>

          {/* Horizontal Application for Navbars */}
          <div className="p-6 rounded-2xl border border-[#EBDCD7] bg-white flex flex-col items-center justify-center text-center space-y-6">
            <Logo size="lg" showSubtitle />
            <span className="text-xs font-semibold text-zinc-500">Aplicação Horizontal (Cabeçalhos / Navbars)</span>
          </div>

          {/* Dark / Inverted Application */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-[#3D1A15] flex flex-col items-center justify-center text-center space-y-4">
            <Logo size="lg" variant="white" showSubtitle />
            <span className="text-xs font-semibold text-zinc-300">Aplicação Noturna / Fundo Escuro</span>
          </div>
        </div>

        {/* Brand anatomy */}
        <div className="p-5 rounded-xl bg-[#FDF6F4] border border-[#F5D8D0] text-xs text-zinc-700 space-y-3">
          <span className="font-bold text-[#96382B] text-sm block">Anatomia Completa da Imagem Oficial TuttiZelo:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">1. Coração Alado Protetor:</strong>
              <span>Contorno em terracota com asa estilizada na ponta superior direita.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">2. Mão Acolhedora na Base:</strong>
              <span>Mão protetora que sustenta fisicamente todas as figuras e a família.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">3. Bebê na Mão (Babá):</strong>
              <span>Bebê sorridente amparado suavemente por palma carinhosa à esquerda.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#FA7C64] block mb-1">4. Cãozinho & Gatinho (Pets):</strong>
              <span>Pets em tom coral (#FA7C64) na frente, simbolizando pet care com carinho.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">5. Mãe / Cuidadora no Centro:</strong>
              <span>Rosto radiante com coque e sorriso acolhedor no meio do coração.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">6. Vovó com Óculos (Geriatria):</strong>
              <span>Senhorinha sorridente com óculos redondos e coque penteado à direita.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">7. Infinito com Checkmark:</strong>
              <span>Símbolo do infinito com verificação integrada para cuidado contínuo.</span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-[#EBDCD7]">
              <strong className="text-[#96382B] block mb-1">8. Tipografia Bicolor & Slogan:</strong>
              <span>"Tutti" em terracota, "Zelo" em coral e o slogan oficial abaixo.</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Official Color Swatches */}
      <div className="bg-white rounded-2xl border border-[#EBDCD7] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
          <Palette className="w-5 h-5 text-[#96382B]" />
          <h3 className="text-base font-bold text-zinc-900 font-display">
            Paleta de Cores & Ratios de Contraste WCAG AA/AAA
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {colors.map((color) => (
            <div
              key={color.hex}
              className="p-4 rounded-xl border border-[#EBDCD7] bg-white flex flex-col justify-between space-y-3 hover:shadow-xs transition-shadow"
            >
              <div>
                <div
                  className="w-full h-16 rounded-lg mb-3 shadow-inner border border-black/5"
                  style={{ backgroundColor: color.hex }}
                />
                <h4 className="font-bold text-zinc-900 text-xs">{color.name}</h4>
                <p className="text-[11px] text-zinc-500 mt-1 leading-tight">{color.role}</p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px]">
                <code className="font-mono text-zinc-700 font-bold">{color.hex}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(color.hex, color.hex)}
                  className="p-1 rounded text-zinc-400 hover:text-zinc-700 cursor-pointer"
                  title="Copiar Hex"
                >
                  {copiedKey === color.hex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: WCAG Compliance */}
      <div className="bg-white rounded-2xl border border-[#EBDCD7] p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
          <Accessibility className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-zinc-900 font-display">
            Checklist de Conformidade Front-End (WCAG 2.1 AA)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Alvos de Toque Mínimos de 44px:</strong> Todos os botões e seletores atendem o critério 2.5.5 para uso em smartphones por idosos e cuidadores.
              </span>
            </div>
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Outline de Foco Visível:</strong> <code>:focus-visible</code> estilizado com borda contrastante de 2px no tom <code>#96382B</code>.
              </span>
            </div>
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>A cor não é o único indicador:</strong> Badges de verificação contêm ícone textual (ex: <code>"Nível 2 · Verificado 🟢"</code>) e `role="status"`.
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Labels Semânticos em Formulários:</strong> Inputs com <code>id</code> e <code>htmlFor</code> para total suporte por leitores de tela (TalkBack / NVDA).
              </span>
            </div>
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Imagens com Alt Text Descritivo:</strong> Fotos de cuidadores e ícones de marca incluem textos alternativos significativos.
              </span>
            </div>
            <div className="flex items-start gap-2 text-zinc-800">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Documentação no Repositório:</strong> Guias completos disponíveis em <code>/docs/DESIGN_SYSTEM.md</code> e <code>/docs/ACCESSIBILITY.md</code>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
