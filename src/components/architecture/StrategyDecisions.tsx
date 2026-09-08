import React, { useState } from 'react';
import {
  Scale,
  ShieldCheck,
  CreditCard,
  Building,
  FileCheck,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Lock,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const StrategyDecisions: React.FC = () => {
  const [openTopic, setOpenTopic] = useState<string>('bureau');

  const topics = [
    {
      id: 'bureau',
      title: '1. Bureaus de Antecedentes Criminais (Brasil)',
      subtitle: 'idwall vs CAF vs unico vs Serpro vs TJs estaduais e custos',
      icon: <Building className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <p>
            <strong>O Desafio Real no Brasil:</strong> Não existe um "banco criminal unificado" aberto em API única gratuita no Brasil. A Polícia Federal cobre crimes federais (SINIC). Já os crimes comuns (furto, agressão, ameaça, lesão) tramitam na justiça estadual (27 Tribunais de Justiça estaduais independentes com sistemas distintos: ESAJ, PJe, Projudi, Eproc).
          </p>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <span className="font-bold block text-amber-950">
              💡 Recomendação Pragmática de Arquitetura & Custos:
            </span>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>Fase 1 (Nível 1 - Identidade):</strong> Validar CPF na Receita + OCR de CNH/RG + Prova de Vida (Liveness 3D) via SDK de bureau parceiro (CAF ou unico). Custo: ~R$ 1,50 a R$ 2,80 por cadastro.
              </li>
              <li>
                <strong>Fase 1 (Nível 2 - Criminal):</strong> Em vez de disparar consulta em 27 estados para todo mundo (custaria R$ 35+ por babá), usar a coluna <code>states_lived char(2)[]</code> que criamos no schema! O cuidador declara onde morou nos últimos 5 anos (ex: SP e RJ). O sistema consulta apenas os TJs dessas UFs + PF + BNMP/CNJ.
              </li>
              <li>
                <strong>Modelo de Repasse de Custo:</strong> A consulta Nível 2 pode ser financiada: (a) Pelo plano Família Pro (R$ 59,90), (b) Como taxa única de ativação subsidiada pelo cuidador (R$ 19,90 com retorno na 1ª contratação), ou (c) Sob demanda quando uma família manifestar interesse de contratação.
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-zinc-900 block">idwall / CAF</span>
              <span className="text-[11px] text-zinc-500 block">Automação de Background Check</span>
              <p className="mt-1 text-[12px] text-zinc-600">
                Líderes em consultas automatizadas via scraping oficial de TJs e certidões estaduais. Possuem SLA de minutos e webhook direto.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-zinc-900 block">Serpro (Governo)</span>
              <span className="text-[11px] text-zinc-500 block">Datavalid Oficial</span>
              <p className="mt-1 text-[12px] text-zinc-600">
                Validação biométrica oficial contra as fotos da CNH (Denatran). Extremamente seguro para validação Nível 1.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-zinc-900 block">Humano em Reviewer</span>
              <span className="text-[11px] text-zinc-500 block">Fallback & Homônimos</span>
              <p className="mt-1 text-[12px] text-zinc-600">
                O estado <code>manual_review</code> que modelamos acolhe certidões positivas de homônimos (nomes comuns) que exigem RG/filiação.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'lgpd',
      title: '2. LGPD & Tratamento de Dados Sensíveis',
      subtitle: 'Finalidade estrita, consentimento revogável e segregação de certidões',
      icon: <Lock className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <p>
            Certidões criminais, biometria facial e dados de saúde de crianças e idosos são enquadrados como <strong>dados sensíveis</strong> ou dados de alta criticidade sob a LGPD (Lei 13.709/2018).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-2">
              <span className="font-bold text-zinc-900 block">O Que NUNCA Pode Ser Exibido Publicamente:</span>
              <ul className="list-disc pl-4 space-y-1 text-zinc-600 text-xs">
                <li>PDF de certidão de antecedentes com número de processos arquivados.</li>
                <li>CPF completo ou RG do cuidador na vitrine pública (apenas truncado ***.456.***-**).</li>
                <li>Selfie bruta de liveness biométrico.</li>
                <li>Endereço residencial exato do cuidador ou da família.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="font-bold text-emerald-950 block">O Que a View <code>caregiver_badges</code> Faz:</span>
              <ul className="list-disc pl-4 space-y-1 text-emerald-900 text-xs">
                <li>Expõe apenas booleanos e data de vigência (ex: <code>level_2_valid_until: 2027-01-12</code>).</li>
                <li>Os arquivos brutos residem em <code>storage.buckets ('verification-private')</code> com acesso exclusivo via <code>service_role</code>.</li>
                <li>Tabela <code>consents</code> guarda IP, User-Agent e versão da política para resguardo em caso de fiscalização da ANPD.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'legal',
      title: '3. Responsabilidade Jurídica do "Selo Verificado"',
      subtitle: 'Evitando responsabilidade objetiva (CDC art. 14 / Teoria do Risco)',
      icon: <Scale className="w-5 h-5 text-rose-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <p>
            No Brasil, a jurisprudência costuma aplicar o Código de Defesa do Consumidor (CDC) a plataformas intermediadoras. Se a TuttiZelo prometer "Garantimos 100% que a pessoa nunca fará nada", ela assume responsabilidade civil objetiva por qualquer dano futuro.
          </p>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <span className="font-bold text-rose-950 block">Como Blindar a Plataforma:</span>
            <ul className="list-disc pl-4 space-y-1 text-xs sm:text-sm">
              <li>
                <strong>Nomenclatura Correta:</strong> Nunca use "Babá 100% Segura". Use <em>"Perfil com Antecedentes Checados em Fontes Públicas Oficiais em [Data X]"</em>.
              </li>
              <li>
                <strong>Validade Temporal (12 Meses):</strong> O selo expira em 12 meses (regra já embutida na nossa trigger <code>valid_until := now() + interval '12 months'</code>).
              </li>
              <li>
                <strong>Termos de Uso Explícitos:</strong> A checagem atesta a ausência de condenações ou mandados de prisão registrados até a data da consulta, cabendo aos pais a entrevista presencial e supervisão contínua.
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'payment',
      title: '4. Automação de Pagamentos & Split Bacen',
      subtitle: 'Complexidade de split, intermediação financeira e retenção fiscal',
      icon: <CreditCard className="w-5 h-5 text-teal-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 space-y-2">
            <span className="font-bold block">
              Resposta à sua pergunta: "Qual será o nível de complexidade da automação dos pagamentos?"
            </span>
            <p>
              <strong>Recomendamos Nível Médio com Split Nativo via Gateway Regulado (Asaas, Iugu ou Pagar.me).</strong>
            </p>
            <p>
              <strong>Por que NÃO fazer transferência manual pela TuttiZelo:</strong> Se o dinheiro da família entrar na conta bancária da TuttiZelo e você transferir manualmente depois para a babá, a Receita Federal entenderá que todo aquele dinheiro foi faturamento da sua empresa, cobrando impostos (Simples/Lucro Presumido) sobre o valor total do plantão!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-zinc-900 block">Arquitetura de Split Bacen:</span>
              <p className="mt-1 text-xs text-zinc-600">
                1. A família paga via PIX/Cartão no gateway regulado.<br />
                2. O gateway divide: 88% vai para a subconta do cuidador e 12% para a TuttiZelo.<br />
                3. A TuttiZelo emite Nota Fiscal apenas sobre a taxa de serviço retida.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50">
              <span className="font-bold text-zinc-900 block">Custódia (Escrow):</span>
              <p className="mt-1 text-xs text-zinc-600">
                O saldo da subconta do cuidador fica bloqueado até o Check-out aprovado pela família. Em caso de falta ou cancelamento prévio, o estorno é automático e sem atrito.
              </p>
            </div>

            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <span className="font-bold text-emerald-950 block">Microsseguro On-Demand (~R$ 3):</span>
              <p className="mt-1 text-xs text-emerald-900">
                Acionado por webhook/API somente no <strong>Check-in</strong> real e encerrado no <strong>Check-out</strong>. Custo de ~R$ 3,00 por plantão absorvido pela taxa da plataforma, cobrindo Acidentes Pessoais (AP) e Responsabilidade Civil (RC).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'roadmap',
      title: '5. Por Onde Começar? (A Escolha Estratégica)',
      subtitle: 'Sequenciamento ágil para solo founder (Kondora Tech)',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      content: (
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          <p>
            Como você é solo founder com background em QA e BI, o segredo da velocidade é <strong>reduzir dependências externas críticas na largada</strong>:
          </p>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <span className="font-bold text-emerald-800 text-xs px-2 py-0.5 rounded bg-emerald-200 shrink-0 mt-0.5">
                FASE 1 (Agora)
              </span>
              <div className="text-xs text-emerald-950">
                <strong>Catálogo das 3 Verticais + Máquina de Estados e Schema no Supabase:</strong> Ter o produto navegável, o cadastro das babás, idosos e pets funcionando, a máquina de estados validada e a curadoria por match operando.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
              <span className="font-bold text-sky-800 text-xs px-2 py-0.5 rounded bg-sky-200 shrink-0 mt-0.5">
                FASE 2
              </span>
              <div className="text-xs text-sky-950">
                <strong>Integração com Bureau & Upload de Certidões:</strong> Conectar webhook de parceiro (ou fluxo manual concierge inicial) para emitir os primeiros selos Nível 1 e Nível 2.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3">
              <span className="font-bold text-zinc-700 text-xs px-2 py-0.5 rounded bg-zinc-200 shrink-0 mt-0.5">
                FASE 3
              </span>
              <div className="text-xs text-zinc-800">
                <strong>Gateway de Split & Transações In-App:</strong> Lançar o fluxo de contratação com retenção de 5-10% e planos de assinatura familiar.
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FDF6F4] text-[#96382B]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-display">
              Bancada Estratégica & Decisões Fundamentais
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500">
              Análise técnica detalhada respondendo a todas as provocações de negócio, LGPD, riscos e split financeiro.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {topics.map((t) => {
          const isOpen = openTopic === t.id;
          return (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenTopic(isOpen ? '' : t.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-zinc-100 shrink-0">{t.icon}</div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900">{t.title}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{t.subtitle}</p>
                  </div>
                </div>

                <div className="p-1 rounded-lg text-zinc-400">
                  {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 pt-2 border-t border-zinc-100">{t.content}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
