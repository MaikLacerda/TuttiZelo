import React, { useState } from 'react';
import {
  Search,
  MessageSquare,
  Video,
  ShieldCheck,
  CreditCard,
  LogIn,
  LogOut,
  Star,
  FileCheck,
  Receipt,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  DollarSign,
  Baby,
  Heart,
  Dog,
  MapPin,
  Activity,
} from 'lucide-react';
import { CaregiverProfile } from '../../types/database';
import { VerificationBadge } from '../brand/Badge';

interface HireAndPaymentFlowProps {
  caregiver: any;
  onBack: () => void;
}

export const HireAndPaymentFlow: React.FC<HireAndPaymentFlowProps> = ({
  caregiver,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [hours, setHours] = useState<number>(4);
  const [contractorPlan, setContractorPlan] = useState<'trimestral' | 'mensal' | 'avulso' | 'free'>('trimestral');
  const [caregiverFeePercent, setCaregiverFeePercent] = useState<number>(12); // Faixa de 10% a 15% da plataforma
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkOutDone, setCheckOutDone] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('Profissional pontual, atenciosa e extremamente cuidadosa. Recomendo com segurança!');

  const hourlyRate = caregiver.hourly_rate_cents / 100;
  const caregiverGrossPay = hourlyRate * hours;
  // Taxa justa da plataforma sobre o profissional contratado (10% a 15%)
  const caregiverFee = (caregiverGrossPay * caregiverFeePercent) / 100;
  const caregiverNetPay = caregiverGrossPay - caregiverFee;
  // Plan fee paid by the contractor (família)
  const contractorFee = contractorPlan === 'avulso' ? 19.90 : 0;
  const totalPaidByContractor = caregiverGrossPay + contractorFee;

  const steps = [
    { id: 1, name: 'Curadoria & Match', icon: <Search className="w-4 h-4" /> },
    { id: 2, name: 'Chat & Entrevista', icon: <Video className="w-4 h-4" /> },
    { id: 3, name: 'Checagem de Antecedentes', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 4, name: 'Contratação & Pagamento In-App', icon: <CreditCard className="w-4 h-4" /> },
    { id: 5, name: 'Check-in (Início do Plantão)', icon: <LogIn className="w-4 h-4" /> },
    { id: 6, name: 'Check-out & Horas', icon: <LogOut className="w-4 h-4" /> },
    { id: 7, name: 'Avaliação Mútua', icon: <Star className="w-4 h-4" /> },
    { id: 8, name: 'Recibo & Split Financeiro', icon: <Receipt className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Busca de Cuidadores</span>
        </button>

        <div className="text-xs text-zinc-500 font-medium">
          Passo <span className="font-bold text-zinc-900">{currentStep}</span> de {steps.length}
        </div>
      </div>

      {/* Progress Stepper Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {steps.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#96382B] text-white shadow-xs'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : step.icon}
                <span className="truncate">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Step Content Container */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Match & Profile Review */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="flex items-center gap-4">
                <img
                  src={caregiver.avatar_url}
                  alt={caregiver.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-100"
                />
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{caregiver.full_name}</h3>
                  <p className="text-xs text-zinc-500">
                    {caregiver.city}, {caregiver.state} • {caregiver.years_experience} anos de experiência
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <VerificationBadge level="level_2_background" />
                    {caregiver.badges.level_3_verified_at && <VerificationBadge level="level_3_plus" />}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-zinc-500">Score de Afinidade Curada</div>
                <div className="text-2xl font-black text-[#96382B]">98% de Match</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
                <span className="font-bold text-zinc-800 block">Especialidades & Competências</span>
                <div className="flex flex-wrap gap-1.5">
                  {caregiver.specialties.map((s: string) => (
                    <span key={s} className="px-2 py-1 rounded-md bg-white border border-zinc-200 font-medium text-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-2">
                <span className="font-bold text-zinc-800 block">Estados com Histórico Criminal Auditado</span>
                <div className="flex items-center gap-2">
                  {caregiver.states_lived.map((uf: string) => (
                    <span key={uf} className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                      TJ{uf} (Nada Consta)
                    </span>
                  ))}
                  <span className="px-2 py-1 rounded-md bg-sky-100 text-sky-800 font-bold font-mono">
                    Polícia Federal
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Avançar para Entrevista & Chat</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Chat & Interview */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900">Entrevista Virtual Prévia & Acordo de Rotina</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Converse com {caregiver.full_name}, alinhe expectativas sobre rotinas, particularidades e normas da residência.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3 max-w-lg">
              <div className="flex items-start gap-3">
                <img src={caregiver.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-zinc-200 text-xs text-zinc-800 space-y-1">
                  <p className="font-semibold text-zinc-900">{caregiver.full_name}</p>
                  <p>
                    {caregiver.category === 'babysitter' && 'Olá! Adoraria cuidar dos seus pequenos. Vi que vocês precisam para este sábado à tarde. Tenho disponibilidade total!'}
                    {caregiver.category === 'elderly_care' && 'Olá! Será um prazer acompanhar seu familiar idoso com zelo, paciência e acompanhamento de medicação e sinais vitais. Tenho disponibilidade!'}
                    {caregiver.category === 'pet_sitter' && 'Olá! Adorarei cuidar do seu pet no conforto do lar, com passeios enriquecedores e carinho garantido!'}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-end gap-3">
                <div className="bg-[#FDF6F4] p-3 rounded-2xl rounded-tr-none border border-[#F5D8D0] text-xs text-zinc-800 space-y-1 text-right">
                  <p className="font-semibold text-[#96382B]">Você (Contratante)</p>
                  <p>
                    {caregiver.category === 'babysitter' && 'Perfeito! Precisaremos das 14h às 18h. Você tem experiência com primeiros socorros pediátricos e rotina sem telas?'}
                    {caregiver.category === 'elderly_care' && 'Perfeito! Das 14h às 18h. Minha mãe precisa de auxílio para caminhar e tomar a medicação de pressão às 16h. Tudo bem?'}
                    {caregiver.category === 'pet_sitter' && 'Ótimo! Precisamos de passeio de 40 min e alimentação às 16h. Você pode enviar fotos e vídeos durante a visita?'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <img src={caregiver.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-zinc-200 text-xs text-zinc-800 space-y-1">
                  <p className="font-semibold text-zinc-900">{caregiver.full_name}</p>
                  <p>
                    {caregiver.category === 'babysitter' && 'Com certeza! Sou certificada em Suporte Básico de Vida Infantil e adoro brincadeiras lúdicas e pedagógicas sem celulares.'}
                    {caregiver.category === 'elderly_care' && 'Certamente! Registro tudo no checklist: aferição de pressão arterial, dosagem exata do medicamento e apoio seguro à locomoção.'}
                    {caregiver.category === 'pet_sitter' && 'Com certeza! Envio relatório com fotos no chat e o trajeto registrado pelo mapa em tempo real.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Conferir Relatório de Antecedentes</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Background Check & Trust Audit */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Auditoria de Antecedentes & Validação da Identidade</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Relatório executado com consentimento LGPD ativo. Apenas selos derivados são exibidos para conformidade civil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">Certidões Criminais Consolidadas</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">NADA CONSTA</span>
                </div>
                <ul className="space-y-1 text-emerald-900">
                  <li>• Tribunal de Justiça do Estado de São Paulo (TJSP)</li>
                  <li>• Tribunal de Justiça do Estado do Rio de Janeiro (TJRJ)</li>
                  <li>• Departamento de Polícia Federal (SINIC)</li>
                  <li>• Banco Nacional de Mandados de Prisão (CNJ)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-950">Prova de Vida & Identidade</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">CONFIRMADO</span>
                </div>
                <ul className="space-y-1 text-sky-900">
                  <li>• CPF Ativo e Regular na Receita Federal do Brasil</li>
                  <li>• OCR de Documento Oficial com Foto (CNH Digital)</li>
                  <li>• Liveness 3D Facial com correspondência biométrica 99.4%</li>
                  <li>• Telefone e E-mail confirmados via 2FA</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Avançar para Pagamento & Split</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: In-App Payment & Split Automation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#96382B]" />
                <span>Contratação & Pagamento In-App com Custódia Segura</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Modelo transparente e compartilhado: o contratante cobre o plano de segurança e o profissional contribui com uma taxa justa de intermediação (10% a 15%).
              </p>
            </div>

            {/* Split Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Form parameters */}
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Modelo de Sustentabilidade TuttiZelo (Taxa Compartilhada):</span>
                  </div>
                  <p className="text-zinc-700 leading-relaxed">
                    Para garantir seguro operacional contra acidentes, custódia escrow protegida pelo Banco Central e tecnologia contínua, o profissional contribui com <strong>10% a 15%</strong> do valor do plantão, recebendo o restante líquido instantaneamente via PIX após o check-out confirmado.
                  </p>

                  <div className="pt-2 border-t border-amber-200/80">
                    <span className="text-[11px] font-bold text-amber-900 block mb-1.5">
                      Taxa de Intermediação do Profissional ({caregiverFeePercent}%):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { pct: 10, label: '10% (Taxa Base)', desc: 'Intermediação & Custódia' },
                        { pct: 12, label: '12% (Padrão)', desc: 'Com Suporte 24h Prioritário' },
                        { pct: 15, label: '15% (Proteção Plus)', desc: 'Com Seguro Estendido' },
                      ].map((rate) => (
                        <button
                          key={rate.pct}
                          type="button"
                          onClick={() => setCaregiverFeePercent(rate.pct)}
                          className={`p-2.5 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                            caregiverFeePercent === rate.pct
                              ? 'bg-amber-100/80 border-amber-500 text-amber-950 font-bold ring-1 ring-amber-500'
                              : 'bg-white border-amber-200/60 text-zinc-700 hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="font-bold">{rate.label}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">{rate.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="duration-hours" className="text-xs font-semibold text-zinc-700 block mb-1">
                     Duração do Plantão / Atendimento (Horas)
                  </label>
                  <input
                    id="duration-hours"
                    type="number"
                    min="1"
                    max="24"
                    value={hours}
                    onChange={(e) => setHours(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 font-bold"
                  />
                </div>

                {/* Plan picker for family (contractor) */}
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-800">
                      Plano do Contratante (Família ou Tutor):
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      O contratante cobre a segurança do serviço
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: 'trimestral',
                        name: 'Plano Trimestral',
                        price: 'R$ 99,90/tri',
                        sub: 'Taxa deste plantão: R$ 0 (Incluso)',
                        badge: 'Mais Escolhido',
                      },
                      {
                        id: 'mensal',
                        name: 'Plano Mensal',
                        price: 'R$ 49,90/mês',
                        sub: 'Taxa deste plantão: R$ 0 (Incluso)',
                      },
                      {
                        id: 'avulso',
                        name: 'Passe Avulso',
                        price: 'R$ 19,90 taxa única',
                        sub: 'Sem assinatura mensal',
                      },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setContractorPlan(p.id as any)}
                        className={`p-3 rounded-xl text-left border text-xs cursor-pointer transition-all ${
                          contractorPlan === p.id
                            ? 'bg-[#FDF6F4] border-[#96382B] text-[#96382B] font-bold ring-1 ring-[#96382B]'
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold">{p.name}</div>
                          {p.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#96382B] text-white">
                              {p.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-mono font-bold mt-1">{p.price}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{p.sub}</div>
                      </button>
                    ))}
                  </div>

                  {contractorPlan === 'free' && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-800">
                      Atenção: O perfil gratuito serve apenas para busca inicial. Para efetuar a contratação e liberar chat e antecedentes, selecione um Plano Mensal, Trimestral ou o Passe Avulso acima.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Split Summary */}
              <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-4">
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                  Demonstrativo Financeiro do Plantão
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Horas de Atendimento ({hours}h × R$ {hourlyRate.toFixed(2)}):
                    </span>
                    <span className="font-semibold font-mono">
                      {caregiverGrossPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="flex justify-between text-amber-300">
                    <span>Taxa da Plataforma ({caregiverFeePercent}% do Profissional):</span>
                    <span className="font-mono font-semibold">
                      - {caregiverFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-emerald-400">
                    <span>Líquido a Receber pelo Profissional:</span>
                    <span className="font-mono">
                      {caregiverNetPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between text-teal-300">
                    <span>
                      Taxa do Contratante ({contractorPlan === 'avulso' ? 'Passe Avulso' : 'Plano Família/Tutor'}):
                    </span>
                    <span className="font-mono font-semibold">
                      {contractorFee === 0 ? 'R$ 0,00 (Incluso no Plano)' : contractorFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Total a Pagar pelo Contratante:</div>
                  <div className="text-xl font-extrabold font-mono text-white">
                    {totalPaidByContractor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1">
                    {contractorFee > 0 ? 'Inclui R$ 19,90 do Passe Avulso + Horas do plantão' : 'Horas do profissional cobertas (plano contratante ativo)'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="w-full py-2.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer shadow-sm min-h-[44px]"
                >
                  Confirmar Pagamento em Custódia Segura
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Check-in (Plantão) */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <LogIn className="w-5 h-5 text-emerald-600" />
                <span>Check-in Seguro no Local do Atendimento</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Garante que o profissional chegou ao endereço da família com validação de geolocalização e aciona a apólice do seguro de acidentes em tempo real.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900">Validar Início do Atendimento</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  O cuidador faz a leitura do QR Code no aplicativo da família para registrar hora exata e coordenadas GPS.
                </p>
              </div>

              {/* Microsseguro On-Demand Box */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-left text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Microsseguro On-Demand Pay-per-use:</span>
                </div>
                <p className="text-emerald-900 text-[11px] leading-relaxed">
                  O check-in dispara a API com a seguradora parceira (custo de <strong>~R$ 3,00</strong> absorvido pela margem da TuttiZelo). Garante cobertura de Acidentes Pessoais (AP) para o cuidador e Responsabilidade Civil (RC) para o domicílio.
                </p>
                <div className="text-[10px] font-mono text-emerald-800 pt-1 border-t border-emerald-200 flex justify-between">
                  <span>Apólice: <code>TZ-SEG-2026-991A</code></span>
                  <span>Vigência: 4 Horas</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCheckInDone(true);
                  setCurrentStep(6);
                }}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer min-h-[44px] shadow-xs"
              >
                Registrar Check-in & Ativar Seguro (14:02)
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Check-out */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <LogOut className="w-5 h-5 text-blue-600" />
                <span>Check-out & Apuração de Horas Efetivas</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Confirmação mútua do término do atendimento para liberação do saldo em custódia e encerramento da apólice.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center max-w-md mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-white border border-zinc-200 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Check-in:</span>
                  <span className="font-bold text-zinc-900">Hoje às 14:02 (Validado GPS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Check-out Previsto:</span>
                  <span className="font-bold text-zinc-900">Hoje às 18:02 (4h00m)</span>
                </div>
                <div className="flex justify-between text-emerald-700 pt-1 border-t border-zinc-100">
                  <span>Status do Seguro:</span>
                  <span className="font-bold">Apólice Ativa sem Sinistros</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCheckOutDone(true);
                  setCurrentStep(7);
                }}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 cursor-pointer min-h-[44px] shadow-xs"
              >
                Confirmar Check-out & Liberar Pagamento
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: Evaluation */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                <span>Avaliação Mútua & Feedback Qualificado</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Avaliações autênticas alimentam o algoritmo de curadoria e mantêm a comunidade segura.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 max-w-lg mx-auto space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-2">
                  Como foi a experiência com {caregiver.full_name}?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-zinc-800 ml-2">{rating}.0 / 5.0</span>
                </div>
              </div>

              <div>
                <label htmlFor="review-text" className="text-xs font-semibold text-zinc-700 block mb-1">
                  Comentário para a Comunidade TuttiZelo
                </label>
                <textarea
                  id="review-text"
                  rows={3}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(8)}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] cursor-pointer min-h-[44px]"
              >
                Enviar Avaliação & Emitir Recibo
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Final Receipt & Tax compliance */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Atendimento Concluído com Sucesso!</h3>
              <p className="text-xs text-zinc-500 mt-1">
                Valores liberados para repasse ao cuidador e recibo digital emitido em conformidade com as normas fiscais brasileiras.
              </p>
            </div>

            {/* Official Digital Receipt Box */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-zinc-300 bg-white max-w-md mx-auto space-y-4 font-mono text-xs text-zinc-800">
              <div className="text-center pb-3 border-b border-zinc-200">
                <div className="font-bold text-sm tracking-tight">TUTTIZELO TECNOLOGIA LTDA</div>
                <div className="text-[10px] text-zinc-500 font-sans">CNPJ: 00.000.000/0001-00 • Plataforma Multi-tenant</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">RECIBO DIGITAL DE INTERMEDIAÇÃO Nº 2026-99214</div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Contratante:</span>
                  <span className="font-semibold">
                    Família Silva ({contractorPlan === 'trimestral' ? 'Plano Trimestral' : contractorPlan === 'mensal' ? 'Plano Mensal' : 'Passe Avulso'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Profissional Cuidador(a):</span>
                  <span className="font-semibold">{caregiver.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Horas Registradas por GPS:</span>
                  <span className="font-semibold">{hours} horas (Check-in & Check-out)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Valor Bruto das Horas de Atendimento:</span>
                  <span className="font-semibold">
                    {caregiverGrossPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-amber-800">
                  <span>Taxa de Intermediação ({caregiverFeePercent}% do Profissional):</span>
                  <span className="font-semibold">
                    - {caregiverFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Taxa/Segurança do Contratante:</span>
                  <span>
                    {contractorFee === 0 ? 'R$ 0,00 (Incluso no Plano Contratante)' : contractorFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Total Liquidado pelo Contratante:</span>
                  <span className="font-bold">
                    {totalPaidByContractor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-zinc-200 font-bold text-sm text-zinc-900">
                  <span>Repasse Líquido Transferido ao Profissional (PIX):</span>
                  <span className="text-emerald-700">
                    {caregiverNetPay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({100 - caregiverFeePercent}%)
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-zinc-400 text-center pt-3 border-t border-zinc-200 font-sans">
                Código de autenticação da transação: <code>TZ-2026-B871-F440-981A</code>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] cursor-pointer min-h-[44px]"
              >
                Voltar ao Catálogo de Cuidadores
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
