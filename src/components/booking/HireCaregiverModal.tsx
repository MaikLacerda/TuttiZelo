import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Copy,
  AlertCircle,
  Sparkles,
  Loader2,
  Repeat,
  Layers,
  Award,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { paymentService, PixPaymentResponse } from '../../services/paymentService';

interface HireCaregiverModalProps {
  caregiver: CaregiverWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

type HiringMode = 'single' | 'package' | 'monthly';

const WEEK_DAYS = [
  { key: 'seg', label: 'Seg' },
  { key: 'ter', label: 'Ter' },
  { key: 'qua', label: 'Qua' },
  { key: 'qui', label: 'Qui' },
  { key: 'sex', label: 'Sex' },
  { key: 'sab', label: 'Sáb' },
  { key: 'dom', label: 'Dom' },
];

export const HireCaregiverModal: React.FC<HireCaregiverModalProps> = ({
  caregiver,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  // Modalidade de contratação
  const [mode, setMode] = useState<HiringMode>('single');

  // Plantão Único
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('08:00');
  const [hours, setHours] = useState(4);

  // Pacote Semanal / Multidias
  const [selectedDays, setSelectedDays] = useState<string[]>(['seg', 'qua', 'sex']);
  const [weeksCount, setWeeksCount] = useState(2);

  // Plano Mensal
  const [monthlyShiftType, setMonthlyShiftType] = useState<'half' | 'full'>('half');
  const [monthlyDaysPerWeek, setMonthlyDaysPerWeek] = useState(5);

  // Fluxo de pagamento
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hiringId, setHiringId] = useState<string>('');
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

  const baseRateCents = caregiver.hourly_rate_cents || 1500;

  // Cálculo financeiro dinâmico
  let totalHours = hours;
  let subtotalCents = 0;
  let feePercent = 12;
  let feeDescription = '';

  if (mode === 'single') {
    totalHours = hours;
    if (hours >= 8) {
      feePercent = 10;
      feeDescription = '10% (Desconto especial para plantão longo)';
    } else if (hours >= 5) {
      feePercent = 12;
      feeDescription = '12% (Taxa padrão de custódia e seguro)';
    } else {
      feePercent = 15;
      feeDescription = '15% (Plantão avulso pontual com cobertura completa)';
    }
    subtotalCents = baseRateCents * hours;
  } else if (mode === 'package') {
    const daysPerWeek = Math.max(1, selectedDays.length);
    const shiftsTotal = daysPerWeek * weeksCount;
    totalHours = shiftsTotal * hours;
    const discountedRateCents = Math.round(baseRateCents * 0.95);
    subtotalCents = discountedRateCents * totalHours;
    feePercent = 10;
    feeDescription = '10% (Taxa reduzida por pacote semanal/quinzenal)';
  } else if (mode === 'monthly') {
    const dailyHours = monthlyShiftType === 'half' ? 4 : 8;
    const monthlyShifts = monthlyDaysPerWeek * 4.2;
    totalHours = Math.round(monthlyShifts * dailyHours);
    const monthlyDiscountedRate = Math.round(baseRateCents * 0.9);
    subtotalCents = monthlyDiscountedRate * totalHours;
    feePercent = 10;
    feeDescription = '10% (Plano Mensal com Seguro Reserva TuttiZelo)';
  }

  const platformFeeCents = Math.round(subtotalCents * (feePercent / 100));
  const totalCents = subtotalCents + platformFeeCents;

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey)
        ? prev.filter((d) => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    let createdId = `hir_${Date.now()}`;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('hirings')
          .insert([
            {
              caregiver_id: caregiver.id,
              family_name: 'Família Contratante',
              hours: totalHours,
              hourly_rate_cents: baseRateCents,
              total_cents: totalCents,
              status: 'pending_payment',
              start_time: `${date}T${startTime}:00Z`,
              hiring_type: mode,
              recurring_days: mode === 'package' ? selectedDays : null,
              weeks_count: mode === 'package' ? weeksCount : 1,
              monthly_backup_guarantee: mode === 'monthly',
            },
          ])
          .select('id')
          .single();

        if (!error && data) {
          createdId = data.id;
        }
      } catch (err) {
        console.warn('Erro ao criar contratação:', err);
      }
    }

    setHiringId(createdId);

    const desc =
      mode === 'single'
        ? `Plantão Avulso ${hours}h com ${caregiver.full_name}`
        : mode === 'package'
        ? `Pacote ${weeksCount} semanas (${totalHours}h) com ${caregiver.full_name}`
        : `Plano Mensal Recorrente (${totalHours}h/mês) com ${caregiver.full_name}`;

    const payment = await paymentService.createPixCharge({
      hiringId: createdId,
      amountCents: totalCents,
      description: `${desc} (${feePercent}% taxa)`,
      payerName: 'Família Contratante',
    });

    setPixData(payment);
    setLoading(false);
    setStep('payment');
    setPollingActive(true);
  };

  useEffect(() => {
    if (!pollingActive || !hiringId || step !== 'payment') return;

    const interval = setInterval(async () => {
      const isPaid = await paymentService.checkPaymentStatus(hiringId);
      if (isPaid) {
        setPollingActive(false);
        setStep('confirmed');
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [pollingActive, hiringId, step]);

  const copyPix = () => {
    if (!pixData?.pixCode) return;
    navigator.clipboard.writeText(pixData.pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateSuccess = async () => {
    if (supabase && hiringId) {
      await supabase
        .from('hirings')
        .update({ status: 'escrow_hold', paid_at: new Date().toISOString() })
        .eq('id', hiringId);
    }
    setPollingActive(false);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ETAPA 1: Configuração */}
        {step === 'details' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <img
                src={caregiver.avatar_url}
                alt={caregiver.full_name}
                className="w-14 h-14 rounded-2xl object-cover border border-zinc-200 shrink-0"
              />
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                  Custódia Garantida
                </span>
                <h3 className="text-lg font-black text-zinc-900 font-display mt-0.5">
                  Contratar {caregiver.full_name}
                </h3>
                <p className="text-xs text-zinc-500">
                  Tarifa base: R$ {(baseRateCents / 100).toFixed(2).replace('.', ',')} / hora
                </p>
              </div>
            </div>

            {/* SELETOR DE MODALIDADE */}
            <div className="grid grid-cols-3 gap-2 bg-zinc-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('single')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  mode === 'single'
                    ? 'bg-white text-[#96382B] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Plantão Único</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('package')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  mode === 'package'
                    ? 'bg-white text-[#96382B] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Pacote Semanal</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('monthly')}
                className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  mode === 'monthly'
                    ? 'bg-white text-[#96382B] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>Plano Mensal</span>
              </button>
            </div>

            {/* PLANTÃO ÚNICO */}
            {mode === 'single' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Data</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Horário Início</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-zinc-700">Duração</label>
                    <span className="text-xs font-bold text-[#96382B]">{hours} horas</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={1}
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full accent-[#96382B] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>2h (15% taxa)</span>
                    <span>6h (12% taxa)</span>
                    <span>8h+ (10% taxa)</span>
                  </div>
                </div>
              </div>
            )}

            {/* PACOTE SEMANAL */}
            {mode === 'package' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Dias da Semana Fixos
                  </label>
                  <div className="flex gap-1.5">
                    {WEEK_DAYS.map((d) => {
                      const active = selectedDays.includes(d.key);
                      return (
                        <button
                          key={d.key}
                          type="button"
                          onClick={() => toggleDay(d.key)}
                          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            active
                              ? 'bg-[#96382B] text-white'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Duração do Pacote</label>
                    <select
                      value={weeksCount}
                      onChange={(e) => setWeeksCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    >
                      <option value={1}>1 Semana</option>
                      <option value={2}>2 Semanas (Quinzenal)</option>
                      <option value={3}>3 Semanas</option>
                      <option value={4}>4 Semanas (1 Mês Fechado)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Horas por Plantão</label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    >
                      <option value={4}>4 horas / dia</option>
                      <option value={6}>6 horas / dia</option>
                      <option value={8}>8 horas / dia (Integral)</option>
                      <option value={12}>12 horas / dia</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Desconto de 5% aplicado</strong> na hora da cuidadora pelo pacote de {totalHours}h!
                  </span>
                </div>
              </div>
            )}

            {/* PLANO MENSAL */}
            {mode === 'monthly' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Frequência Semanal</label>
                    <select
                      value={monthlyDaysPerWeek}
                      onChange={(e) => setMonthlyDaysPerWeek(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    >
                      <option value={3}>3 dias por semana</option>
                      <option value={5}>5 dias por semana (Seg a Sex)</option>
                      <option value={6}>6 dias por semana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Jornada Diária</label>
                    <select
                      value={monthlyShiftType}
                      onChange={(e) => setMonthlyShiftType(e.target.value as 'half' | 'full')}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-[#96382B]"
                    >
                      <option value="half">Meio Período (4h/dia)</option>
                      <option value="full">Integral (8h/dia)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Garantia de Cuidadora Reserva TuttiZelo Inclusa</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    Se a profissional adoecer ou precisar faltar, nossa central aloca uma substituta homologada na mesma hora sem custo extra.
                  </p>
                </div>
              </div>
            )}

            {/* RESUMO FINANCEIRO */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>
                  {mode === 'single'
                    ? `Cuidado (${hours} horas):`
                    : mode === 'package'
                    ? `Total de Cuidado (${totalHours} horas no pacote):`
                    : `Total Cuidado Mensal (~${totalHours} horas):`}
                </span>
                <span>R$ {(subtotalCents / 100).toFixed(2).replace('.', ',')}</span>
              </div>

              <div className="flex justify-between text-zinc-700 font-semibold">
                <span>Taxa de Seguro e Custódia ({feePercent}%):</span>
                <span>R$ {(platformFeeCents / 100).toFixed(2).replace('.', ',')}</span>
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-1">{feeDescription}</span>

              <div className="border-t border-zinc-200 pt-2 flex justify-between font-black text-sm text-zinc-900">
                <span>Total com Garantia:</span>
                <span className="text-[#96382B]">
                  R$ {(totalCents / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Cobrança Bancária...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {mode === 'single'
                      ? 'Gerar PIX do Plantão'
                      : mode === 'package'
                      ? 'Gerar PIX do Pacote com Desconto'
                      : 'Contratar Plano Mensal Protegido'}
                  </span>
                </>
              )}
            </button>
          </div>
        )}

        {/* ETAPA 2: Pagamento PIX com QR Code Real */}
        {step === 'payment' && (
          <div className="space-y-4 text-center">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                Aguardando Pagamento PIX
              </span>
              <h3 className="text-lg font-black text-zinc-900 font-display">
                {mode === 'single'
                  ? 'Escaneie o QR Code'
                  : mode === 'package'
                  ? 'Pagamento do Pacote'
                  : 'Ativação do Plano Mensal'}
              </h3>
              <p className="text-xs text-zinc-500">
                Valor Total: <strong>R$ {(totalCents / 100).toFixed(2).replace('.', ',')}</strong>
              </p>
            </div>

            {pixData?.qrCodeUrl && (
              <div className="flex justify-center py-1">
                <div className="p-3 bg-white border-2 border-dashed border-emerald-300 rounded-3xl shadow-xs">
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-44 h-44 rounded-xl object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Código PIX Copia e Cola</span>
              <p className="text-[10px] font-mono text-zinc-600 truncate bg-white p-2 rounded-lg border border-zinc-200 select-all">
                {pixData?.pixCode}
              </p>
              <button
                type="button"
                onClick={copyPix}
                className="w-full py-2 bg-white border border-zinc-300 hover:bg-zinc-100 text-xs font-bold text-zinc-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Código Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código PIX</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400 py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span>Aguardando liquidação bancária automática via Asaas...</span>
            </div>

            <button
              type="button"
              onClick={simulateSuccess}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
            >
              Simular Baixa Imediata (Ambiente de Teste)
            </button>
          </div>
        )}

        {/* ETAPA 3: Confirmado */}
        {step === 'confirmed' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900 font-display">
                {mode === 'single'
                  ? 'Plantão Confirmado em Custódia!'
                  : mode === 'package'
                  ? 'Pacote Semanal Ativado com Sucesso!'
                  : 'Plano Mensalista Ativado com Sucesso!'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                A profissional <strong>{caregiver.full_name}</strong> já recebeu a escala e os valores estão protegidos pelo cofre TuttiZelo.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-500">Modalidade:</span>
                <span className="font-bold text-zinc-800">
                  {mode === 'single' ? 'Plantão Avulso' : mode === 'package' ? 'Pacote Semanal' : 'Plano Mensal'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total de Horas:</span>
                <span className="font-bold text-zinc-800">{totalHours} horas contratadas</span>
              </div>
              {mode === 'monthly' && (
                <div className="flex justify-between">
                  <span className="text-zinc-500">Reserva de Emergência:</span>
                  <span className="font-bold text-emerald-700">Cuidadora Substituta Garantida</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer"
            >
              Finalizar e Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
