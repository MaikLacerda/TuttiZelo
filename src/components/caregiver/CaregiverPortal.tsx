import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  Send,
  Building,
  User,
  Sparkles,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Download,
  Eye,
  X,
  Phone,
  QrCode,
  Lock,
  Percent,
} from 'lucide-react';
import { MOCK_CAREGIVERS } from '../../data/mockData';
import { CaregiverWithDetails } from '../../types/database';

interface ShiftTransaction {
  id: string;
  contractorName: string;
  categoryLabel: string;
  date: string;
  timeRange: string;
  hoursWorked: number;
  hourlyRate: number;
  grossAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  netAmount: number;
  status: 'liquidated' | 'escrow' | 'processing';
  payoutDate: string;
  pixKeyUsed: string;
  insurancePolicyId: string;
  address: string;
  notes?: string;
}

export const CaregiverPortal: React.FC = () => {
  // Active caregiver selector (mocking login as one of the 3 pillars)
  const [selectedCaregiverId, setSelectedCaregiverId] = useState<string>('cg-001');
  const activeCaregiver = (MOCK_CAREGIVERS.find((c) => c.id === selectedCaregiverId) ||
    MOCK_CAREGIVERS[0]) as CaregiverWithDetails;

  // Active tab
  const [activeTab, setActiveTab] = useState<'statement' | 'schedule' | 'pix' | 'calculator'>('statement');

  // Interactive balance and withdrawal state
  const [availableBalance, setAvailableBalance] = useState<number>(864.2);
  const [escrowBalance, setEscrowBalance] = useState<number>(396.0);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('864.20');
  const [withdrawSuccess, setWithdrawSuccess] = useState<boolean>(false);
  const [pixKeyType, setPixKeyType] = useState<'cpf' | 'email' | 'phone' | 'random'>('cpf');
  const [pixKeyValue, setPixKeyValue] = useState<string>('348.912.048-22');
  const [selectedReceipt, setSelectedReceipt] = useState<ShiftTransaction | null>(null);

  // Calculator states
  const [calcHoursPerWeek, setCalcHoursPerWeek] = useState<number>(20);
  const [calcHourlyRate, setCalcHourlyRate] = useState<number>(
    activeCaregiver.hourly_rate_cents / 100
  );
  const [calcFeePercent, setCalcFeePercent] = useState<number>(12);

  // Mock transactions for each caregiver
  const [transactions, setTransactions] = useState<ShiftTransaction[]>([
    {
      id: 'TRX-2026-0812',
      contractorName: 'Família Vasconcelos',
      categoryLabel: 'Babá & Cuidado Infantil',
      date: '06/09/2026',
      timeRange: '13:00 às 18:00',
      hoursWorked: 5,
      hourlyRate: 45,
      grossAmount: 225,
      platformFeePercent: 12,
      platformFeeAmount: 27,
      netAmount: 198,
      status: 'liquidated',
      payoutDate: '06/09/2026 às 18:04',
      pixKeyUsed: '348.912.048-22',
      insurancePolicyId: 'TZ-SEG-2026-881A',
      address: 'Rua Bela Cintra, 1420 - Jardins, São Paulo/SP',
      notes: 'Apoio na rotina escolar e introdução alimentar do Benício (2 anos).',
    },
    {
      id: 'TRX-2026-0809',
      contractorName: 'Dra. Camila & Pedro',
      categoryLabel: 'Babá & Cuidado Infantil',
      date: '04/09/2026',
      timeRange: '14:00 às 19:00',
      hoursWorked: 5,
      hourlyRate: 45,
      grossAmount: 225,
      platformFeePercent: 12,
      platformFeeAmount: 27,
      netAmount: 198,
      status: 'liquidated',
      payoutDate: '04/09/2026 às 19:02',
      pixKeyUsed: '348.912.048-22',
      insurancePolicyId: 'TZ-SEG-2026-792B',
      address: 'Av. Brigadeiro Luis Antonio, 3200 - Paraíso, São Paulo/SP',
      notes: 'Plantão vespertino com recreação pedagógica.',
    },
    {
      id: 'TRX-2026-0798',
      contractorName: 'Família Rocha',
      categoryLabel: 'Plantão Noturno / FDS',
      date: '30/08/2026',
      timeRange: '18:00 às 23:00',
      hoursWorked: 5,
      hourlyRate: 50,
      grossAmount: 250,
      platformFeePercent: 10,
      platformFeeAmount: 25,
      netAmount: 225,
      status: 'liquidated',
      payoutDate: '30/08/2026 às 23:03',
      pixKeyUsed: '348.912.048-22',
      insurancePolicyId: 'TZ-SEG-2026-614D',
      address: 'Rua Harmonia, 510 - Vila Madalena, São Paulo/SP',
      notes: 'Plantão de fim de semana com acompanhamento de sono.',
    },
    {
      id: 'TRX-2026-0815',
      contractorName: 'Família Siqueira',
      categoryLabel: 'Plantão em Andamento / Agendado',
      date: '08/09/2026 (Amanhã)',
      timeRange: '09:00 às 17:00',
      hoursWorked: 8,
      hourlyRate: 45,
      grossAmount: 360,
      platformFeePercent: 12,
      platformFeeAmount: 43.2,
      netAmount: 316.8,
      status: 'escrow',
      payoutDate: 'Liberação após Check-out',
      pixKeyUsed: '348.912.048-22',
      insurancePolicyId: 'TZ-SEG-2026-991A (Ativação no Check-in)',
      address: 'Rua Pamplona, 980 - Bela Vista, São Paulo/SP',
      notes: 'Cuidado integral das 9h às 17h. Almoço e parque infantil.',
    },
  ]);

  // Handle PIX Withdrawal
  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0 || amountNum > availableBalance) {
      return;
    }

    setAvailableBalance((prev) => Math.max(0, prev - amountNum));
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setIsWithdrawModalOpen(false);
    }, 2200);
  };

  // Unit Economics projections
  const monthlyGrossProjected = calcHoursPerWeek * 4.33 * calcHourlyRate;
  const monthlyFeeProjected = monthlyGrossProjected * (calcFeePercent / 100);
  const monthlyNetProjected = monthlyGrossProjected - monthlyFeeProjected;
  const traditionalAgencyFee = monthlyGrossProjected * 0.3; // 30% em agência tradicional
  const monthlySavingsVsTraditional = traditionalAgencyFee - monthlyFeeProjected;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header & Caregiver Persona Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FDF6F4] border border-[#F5D8D0] flex items-center justify-center text-[#96382B]">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900 font-display">
                  Minha Carteira & Painel do Cuidador
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Split Bacen Ativo
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Acompanhamento transparente de saldo, custódia escrow, repasses via PIX e apólices de seguro.
              </p>
            </div>
          </div>

          {/* Persona Switcher to test all 3 categories */}
          <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-zinc-200 self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-zinc-500 pl-2 hidden md:inline">
              Simular Perfil:
            </span>
            <select
              value={selectedCaregiverId}
              onChange={(e) => setSelectedCaregiverId(e.target.value)}
              className="text-xs font-bold bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-800 cursor-pointer"
            >
              {MOCK_CAREGIVERS.slice(0, 3).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.category === 'babysitter' ? 'Babá' : c.category === 'elderly_care' ? 'Idosos' : 'Pet Sitter'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Caregiver Mini Banner */}
        <div className="pt-4 border-t border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <img
              src={activeCaregiver.avatar_url}
              alt={activeCaregiver.full_name}
              className="w-11 h-11 rounded-xl object-cover border border-zinc-200 shadow-2xs"
            />
            <div>
              <div className="font-bold text-zinc-900 text-sm flex items-center gap-1.5">
                <span>{activeCaregiver.full_name}</span>
                <span className="text-emerald-700 font-normal text-xs font-mono">
                  (R$ {(activeCaregiver.hourly_rate_cents / 100).toFixed(2)}/h)
                </span>
              </div>
              <div className="text-zinc-500 text-[11px] flex items-center gap-2 mt-0.5">
                <span>
                  {activeCaregiver.category === 'babysitter' && '👶 Babá & Cuidado Infantil'}
                  {activeCaregiver.category === 'elderly_care' && '🧓 Cuidadora de Idosos'}
                  {activeCaregiver.category === 'pet_sitter' && '🐾 Pet Sitter & Dog Walker'}
                </span>
                <span>•</span>
                <span className="text-amber-700 font-semibold">★ {activeCaregiver.rating || 4.9}</span>
                <span>•</span>
                <span className="text-zinc-500">{activeCaregiver.city}, {activeCaregiver.state}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Seguro de Plantão SUSEP Incluso</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-700 text-[11px] font-mono">
              Chave PIX: {pixKeyValue}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Balances and Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="p-5 rounded-2xl bg-zinc-900 text-white space-y-3 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold">
            <span>Saldo Disponível (PIX)</span>
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              {availableBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <span className="text-[11px] text-zinc-400 mt-0.5 block">
              Pronto para transferência imediata
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setWithdrawAmount(availableBalance.toFixed(2));
              setIsWithdrawModalOpen(true);
            }}
            disabled={availableBalance <= 0}
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed min-h-[44px]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sacar Saldo via PIX</span>
          </button>
        </div>

        {/* Escrow Balance */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Em Custódia Segura (Escrow)</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-zinc-900">
              {escrowBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">
              Plantões aguardando check-out
            </span>
          </div>
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>1 plantão em andamento</span>
          </div>
        </div>

        {/* Monthly Gross & Platform Fee */}
        <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 text-xs font-semibold">
            <span>Ganhos Totais no Mês</span>
            <TrendingUp className="w-4 h-4 text-[#96382B]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-zinc-900">
              R$ 1.035,00
            </div>
            <span className="text-[11px] text-zinc-500 mt-0.5 block">
              Taxa média TuttiZelo: <strong>12%</strong>
            </span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-50 text-[11px] text-zinc-600 flex justify-between font-mono">
            <span>Retenção Justa:</span>
            <span className="text-amber-800 font-bold">- R$ 124,20</span>
          </div>
        </div>

        {/* Insurance Protection Badge */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-emerald-900 text-xs font-semibold">
            <span>Seguro de Acidentes Ativo</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-emerald-950 font-display">
              Apólice Coletiva SUSEP
            </div>
            <span className="text-[11px] text-emerald-800 mt-0.5 block">
              R$ 0,00 descontado de você
            </span>
          </div>
          <div className="text-[11px] text-emerald-900 leading-snug">
            Cobre despesas médicas em caso de acidente, trajeto ou ocorrências durante o cuidado.
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-zinc-200 flex items-center gap-2 overflow-x-auto pb-px">
        {[
          { id: 'statement', label: 'Extrato & Repasses', icon: <FileText className="w-4 h-4" /> },
          { id: 'schedule', label: 'Plantões & Agenda', icon: <Calendar className="w-4 h-4" /> },
          { id: 'pix', label: 'Configurar Chave PIX', icon: <DollarSign className="w-4 h-4" /> },
          { id: 'calculator', label: 'Simulador de Faturamento', icon: <Percent className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === tab.id
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Statement & Transactions */}
      {activeTab === 'statement' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-900 font-display">
                Extrato Discriminado de Atendimentos
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Valores brutos, retenção da plataforma (10% a 15%), apólice do seguro e repasses líquidos via PIX.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Período:</span>
              <span className="text-xs font-bold bg-white px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-800">
                Setembro / 2026 (Mês Vigente)
              </span>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs divide-y divide-zinc-100">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="p-4 sm:p-5 hover:bg-zinc-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-zinc-900 text-sm">{t.contractorName}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-xs text-zinc-600">{t.categoryLabel}</span>
                    {t.status === 'liquidated' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>PIX Liquidado</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>Em Custódia Escrow</span>
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-zinc-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {t.date} ({t.timeRange})
                    </span>
                    <span>•</span>
                    <span>{t.hoursWorked} horas (auditadas por GPS)</span>
                    <span>•</span>
                    <span className="text-emerald-800 font-mono text-[11px]">
                      Seguro: {t.insurancePolicyId}
                    </span>
                  </div>

                  {t.notes && (
                    <p className="text-xs text-zinc-600 italic bg-zinc-50 p-2 rounded-lg border border-zinc-100">
                      "{t.notes}"
                    </p>
                  )}
                </div>

                {/* Financial breakdown */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-100">
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">
                      Bruto: {t.grossAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}{' '}
                      <span className="text-amber-800 font-semibold font-mono">
                        (-{t.platformFeePercent}% = -R$ {t.platformFeeAmount.toFixed(2)})
                      </span>
                    </div>
                    <div className="text-base font-extrabold font-mono text-emerald-700">
                      {t.netAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {t.status === 'liquidated' ? t.payoutDate : 'Saldo retido no Bacen'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(t)}
                    className="p-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-100 cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 text-xs font-bold shadow-2xs"
                    title="Ver Recibo Completo"
                  >
                    <FileText className="w-4 h-4 text-zinc-500" />
                    <span className="hidden sm:inline">Comprovante</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Schedule & Upcoming Shifts */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 font-display">
              Próximos Plantões & Atendimentos Agendados
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Instruções de portaria, endereço, checklist da rotina e acionamento de check-in geolocalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shift 1 (Amanhã) */}
            <div className="p-5 rounded-2xl bg-white border-2 border-emerald-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Amanhã • Confirmado
                  </span>
                  <h3 className="font-bold text-zinc-900 text-base mt-1">
                    Família Siqueira (Benício, 2 anos)
                  </h3>
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>08/09/2026 das 09:00 às 17:00 (8 horas)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-500">Valor Líquido</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700">R$ 316,80</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <div className="flex items-start gap-2 text-zinc-700">
                  <MapPin className="w-4 h-4 text-[#96382B] shrink-0 mt-0.5" />
                  <span>
                    <strong>Endereço:</strong> Rua Pamplona, 980 - Apto 82, Bela Vista, São Paulo/SP
                  </span>
                </div>
                <div className="text-zinc-600 text-[11px] pl-6">
                  Portaria com biometria facial autorizada. Avisar que é da TuttiZelo.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1 text-emerald-950">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Microsseguro SUSEP Pré-autorizado:</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  A apólice <code>TZ-SEG-2026-991A</code> entrará em vigor instantaneamente assim que você registrar o Check-in com GPS no local. Custo R$ 0 para você.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    alert('Rota aberta no aplicativo de mapas (Google Maps / Waze).')
                  }
                  className="flex-1 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>Ver Rota</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Check-in simulado com sucesso! A apólice de seguro de acidentes está oficialmente ativa.'
                    )
                  }
                  className="flex-1 py-2.5 rounded-xl bg-[#96382B] hover:bg-[#7D2E23] text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Fazer Check-in</span>
                </button>
              </div>
            </div>

            {/* Shift 2 (Sexta-feira) */}
            <div className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-700">
                    Sexta-feira • Agendado
                  </span>
                  <h3 className="font-bold text-zinc-900 text-base mt-1">
                    Família Vasconcelos (Recreação Escolar)
                  </h3>
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>11/09/2026 das 13:00 às 18:00 (5 horas)</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-500">Valor Líquido</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700">R$ 198,00</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
                <div className="flex items-start gap-2 text-zinc-700">
                  <MapPin className="w-4 h-4 text-[#96382B] shrink-0 mt-0.5" />
                  <span>
                    <strong>Endereço:</strong> Rua Bela Cintra, 1420 - Jardins, São Paulo/SP
                  </span>
                </div>
                <div className="text-zinc-600 text-[11px] pl-6">
                  Cliente recorrente há 3 meses. Chaves e rotina combinadas no chat in-app.
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    alert('Rota aberta no aplicativo de mapas (Google Maps / Waze).')
                  }
                  className="w-full py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                >
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>Ver Rota no Mapa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PIX Settings */}
      {activeTab === 'pix' && (
        <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 font-display">
              Configuração de Recebimento via PIX
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Todos os repasses líquidos são transferidos automaticamente para a chave cadastrada após o check-out confirmado.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Regra de Titularidade Bancária Antifraude:</span>
            </div>
            <p className="text-zinc-700 leading-relaxed text-[11px]">
              Por conformidade com as normas do Banco Central, a conta de destino deve estar obrigatoriamente vinculada ao mesmo CPF aprovado na validação de antecedentes ({activeCaregiver.full_name}).
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Chave PIX atualizada e validada com sucesso na rede do Banco Central!');
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1.5">
                Tipo de Chave PIX
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'cpf', label: 'CPF' },
                  { id: 'phone', label: 'Celular' },
                  { id: 'email', label: 'E-mail' },
                  { id: 'random', label: 'Aleatória' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPixKeyType(type.id as any)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      pixKeyType === type.id
                        ? 'border-[#96382B] bg-[#FDF6F4] text-[#96382B]'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="pix-key-input" className="text-xs font-semibold text-zinc-700 block mb-1">
                Chave PIX Cadastrada
              </label>
              <input
                id="pix-key-input"
                type="text"
                value={pixKeyValue}
                onChange={(e) => setPixKeyValue(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 font-mono font-bold bg-white"
              />
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5">
              <span className="font-bold text-zinc-800 block">Conta Bancária Reconhecida:</span>
              <div className="grid grid-cols-2 gap-2 text-zinc-600 text-[11px]">
                <div>
                  <span className="text-zinc-400 block">Instituição:</span>
                  <strong>Nu Pagamentos S.A. (Nubank - 260)</strong>
                </div>
                <div>
                  <span className="text-zinc-400 block">Titular:</span>
                  <strong>{activeCaregiver.full_name}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer min-h-[44px]"
              >
                Salvar & Validar Chave PIX
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Earnings Calculator & Unit Economics */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-zinc-900 font-display">
              Simulador de Rendimento & Comparativo de Taxas
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              Veja a diferença entre a taxa justa da TuttiZelo (10% a 15%) e as taxas abusivas de agências físicas tradicionais (30%).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                  <span>Horas Trabalhadas por Semana:</span>
                  <span className="font-mono font-bold text-[#96382B]">{calcHoursPerWeek} horas/semana</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={calcHoursPerWeek}
                  onChange={(e) => setCalcHoursPerWeek(Number(e.target.value))}
                  className="w-full accent-[#96382B] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                  <span>5h (ocasional)</span>
                  <span>20h (meio período)</span>
                  <span>44h (integral)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-zinc-700 mb-1">
                  <span>Seu Valor por Hora (R$/h):</span>
                  <span className="font-mono font-bold text-zinc-900">R$ {calcHourlyRate.toFixed(2)}/h</span>
                </div>
                <input
                  type="range"
                  min="25"
                  max="120"
                  step="5"
                  value={calcHourlyRate}
                  onChange={(e) => setCalcHourlyRate(Number(e.target.value))}
                  className="w-full accent-[#96382B] cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-zinc-700 block mb-1.5">
                  Taxa da Plataforma Selecionada:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { pct: 10, label: '10% (Base)' },
                    { pct: 12, label: '12% (Padrão)' },
                    { pct: 15, label: '15% (Plus)' },
                  ].map((rate) => (
                    <button
                      key={rate.pct}
                      type="button"
                      onClick={() => setCalcFeePercent(rate.pct)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold cursor-pointer transition-all ${
                        calcFeePercent === rate.pct
                          ? 'border-[#96382B] bg-[#FDF6F4] text-[#96382B]'
                          : 'border-zinc-200 bg-white text-zinc-600'
                      }`}
                    >
                      {rate.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Vantagem Financeira TuttiZelo:</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Você economiza cerca de <strong>{monthlySavingsVsTraditional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</strong> que seriam engolidos por comissões de agências convencionais.
                </p>
              </div>
            </div>

            {/* Comparative Result Box */}
            <div className="p-6 rounded-2xl bg-zinc-900 text-white space-y-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                  Projeção Mensal Estimada
                </h4>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
                  {monthlyNetProjected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  <span className="text-xs text-zinc-400 font-normal ml-1">líquido/mês</span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs pt-4 border-t border-zinc-800">
                <div className="flex justify-between text-zinc-300">
                  <span>Faturamento Bruto Total:</span>
                  <span className="font-mono font-semibold">
                    {monthlyGrossProjected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>Taxa TuttiZelo ({calcFeePercent}%):</span>
                  <span className="font-mono font-semibold">
                    - {monthlyFeeProjected.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-300">
                  <span>Seguro de Plantão SUSEP:</span>
                  <span className="font-semibold font-mono">Incluso (R$ 0,00)</span>
                </div>
                <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-800 text-[11px]">
                  <span>Se estivesse em agência (30%):</span>
                  <span className="font-mono line-through">
                    - {traditionalAgencyFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-200">
                Maior autonomia, proteção jurídica garantida e recebimento no mesmo dia sem calotes.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PIX Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-zinc-200 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-900 font-display">
                  Solicitar Saque Imediato via PIX
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Transferência em tempo real para a sua conta vinculada.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-emerald-950">
                  PIX Transferido com Sucesso!
                </h4>
                <p className="text-xs text-emerald-800">
                  O valor de{' '}
                  <strong>
                    {parseFloat(withdrawAmount).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </strong>{' '}
                  foi enviado para a sua conta Nubank.
                </p>
                <div className="text-[10px] font-mono text-emerald-700">
                  Autenticação: <code>PIX-BACEN-{Date.now()}</code>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdrawal} className="space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                  <div className="flex justify-between text-zinc-500">
                    <span>Saldo Disponível:</span>
                    <span className="font-mono font-bold text-zinc-900">
                      {availableBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Chave de Destino:</span>
                    <span className="font-mono font-semibold text-zinc-800">{pixKeyValue}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="withdraw-amount" className="text-xs font-semibold text-zinc-700 block mb-1">
                    Valor a Transferir (R$)
                  </label>
                  <input
                    id="withdraw-amount"
                    type="number"
                    step="0.01"
                    min="1"
                    max={availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base rounded-xl border border-zinc-300 font-mono font-bold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount((availableBalance / 2).toFixed(2))}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  >
                    50%
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(availableBalance.toFixed(2))}
                    className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                  >
                    100% (Tudo)
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer min-h-[44px]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer min-h-[44px] shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmar Envio</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedReceipt && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 border border-zinc-200 shadow-2xl">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 font-display">
                  Recibo Digital de Intermediação & Repasse
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">
                  ID: {selectedReceipt.id} • TuttiZelo Tecnologia
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1.5 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">Contratante:</span>
                <span className="font-bold text-zinc-900">{selectedReceipt.contractorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Profissional Cuidador(a):</span>
                <span className="font-bold text-zinc-900">{activeCaregiver.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Data e Duração:</span>
                <span>
                  {selectedReceipt.date} • {selectedReceipt.hoursWorked} horas
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Valor Bruto das Horas:</span>
                <span className="font-bold">
                  {selectedReceipt.grossAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between text-amber-800">
                <span>Taxa da Plataforma ({selectedReceipt.platformFeePercent}%):</span>
                <span>
                  - {selectedReceipt.platformFeeAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Microsseguro SUSEP:</span>
                <span>{selectedReceipt.insurancePolicyId} (Incluso)</span>
              </div>
              <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-900">
                <span>Repasse Líquido Transferido:</span>
                <span className="text-emerald-700">
                  {selectedReceipt.netAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 text-center">
              Transação processada sob regras de split automático e custódia segura reguladas pelo Banco Central do Brasil.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 cursor-pointer min-h-[44px]"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  alert('Comprovante exportado em formato PDF assinado digitalmente.');
                  setSelectedReceipt(null);
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
