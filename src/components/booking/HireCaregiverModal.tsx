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
  Percent,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { supabase } from '../../lib/supabase';
import { paymentService, PixPaymentResponse } from '../../services/paymentService';

interface HireCaregiverModalProps {
  caregiver: CaregiverWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const HireCaregiverModal: React.FC<HireCaregiverModalProps> = ({
  caregiver,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [startTime, setStartTime] = useState('08:00');
  const [hours, setHours] = useState(4);
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hiringId, setHiringId] = useState<string>('');
  const [pixData, setPixData] = useState<PixPaymentResponse | null>(null);
  const [pollingActive, setPollingActive] = useState(false);

  // REGRA DINÂMICA DE TAXA TUTTIZELO (10% A 15%)
  // - Plantões longos (>= 8h): 10% (benefício por volume)
  // - Plantões médios (5h a 7h): 12% (taxa padrão de custódia e seguro)
  // - Plantões curtos (2h a 4h): 15% (cobertura intensiva de seguro e garantia mínima)
  const getFeePercentage = (h: number): { percent: number; label: string } => {
    if (h >= 8) {
      return { percent: 10, label: '10% (Desconto especial para plantão estendido)' };
    } else if (h >= 5) {
      return { percent: 12, label: '12% (Taxa padrão de custódia e seguro)' };
    } else {
      return { percent: 15, label: '15% (Plantão pontual com cobertura completa)' };
    }
  };

  const { percent: feePercent, label: feeLabel } = getFeePercentage(hours);

  const rateCents = caregiver.hourly_rate_cents || 1500;
  const subtotalCents = rateCents * hours;
  const platformFeeCents = Math.round(subtotalCents * (feePercent / 100));
  const totalCents = subtotalCents + platformFeeCents;

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
              hours,
              hourly_rate_cents: rateCents,
              total_cents: totalCents,
              status: 'pending_payment',
              start_time: `${date}T${startTime}:00Z`,
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

    // Gera cobrança no Gateway
    const payment = await paymentService.createPixCharge({
      hiringId: createdId,
      amountCents: totalCents,
      description: `Plantão ${hours}h com ${caregiver.full_name} (${feePercent}% taxa TuttiZelo)`,
      payerName: 'Família Contratante',
    });

    setPixData(payment);
    setLoading(false);
    setStep('payment');
    setPollingActive(true);
  };

  // Polling para detectar confirmação bancária em tempo real
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

        {/* ETAPA 1: Detalhes */}
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
                  Plantão Protegido
                </span>
                <h3 className="text-lg font-black text-zinc-900 font-display mt-0.5">
                  Agendar com {caregiver.full_name}
                </h3>
                <p className="text-xs text-zinc-500">
                  Tarifa: R$ {(rateCents / 100).toFixed(2).replace('.', ',')} / hora
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Data do Plantão</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:outline-none focus:border-[#96382B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Horário de Início</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:outline-none focus:border-[#96382B]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-zinc-700">Duração do Plantão</label>
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
                <span>8h+ (10% taxa reduzida)</span>
              </div>
            </div>

            {/* Resumo Financeiro com Taxa Dinâmica de 10% a 15% */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Cuidado do Profissional ({hours}h):</span>
                <span>R$ {(subtotalCents / 100).toFixed(2).replace('.', ',')}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700 font-semibold">
                  <span className="flex items-center gap-1">
                    Taxa TuttiZelo Escrow ({feePercent}%):
                  </span>
                  <span>R$ {(platformFeeCents / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <span className="text-[10px] text-zinc-400 block">
                  {feeLabel} • Cobertura de seguro contra acidentes e custódia bancária
                </span>
              </div>

              <div className="border-t border-zinc-200 pt-2 flex justify-between font-black text-sm text-zinc-900">
                <span>Total Garantido:</span>
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
                  <span>Gerar PIX com Custódia ({feePercent}% Taxa)</span>
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
                Aguardando Pagamento
              </span>
              <h3 className="text-lg font-black text-zinc-900 font-display">Escaneie o QR Code PIX</h3>
              <p className="text-xs text-zinc-500">
                Valor: <strong>R$ {(totalCents / 100).toFixed(2).replace('.', ',')}</strong> (Taxa de {feePercent}% inclusa)
              </p>
            </div>

            {/* Imagem do QR Code Oficial */}
            {pixData?.qrCodeUrl && (
              <div className="flex justify-center py-2">
                <div className="p-3 bg-white border-2 border-dashed border-emerald-300 rounded-3xl shadow-xs">
                  <img
                    src={pixData.qrCodeUrl}
                    alt="QR Code PIX"
                    className="w-44 h-44 rounded-xl object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Chave Copia e Cola */}
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
              <span>Identificando pagamento bancário automaticamente...</span>
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
              <h3 className="text-xl font-black text-zinc-900 font-display">Pagamento Confirmado em Custódia!</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                O valor foi retido com segurança e a cuidadora <strong>{caregiver.full_name}</strong> já recebeu o chamado na agenda.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-500">Data e Hora:</span>
                <span className="font-bold text-zinc-800">{date} às {startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Duração:</span>
                <span className="font-bold text-zinc-800">{hours} horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Taxa Aplicada:</span>
                <span className="font-bold text-zinc-800">{feePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Garantia:</span>
                <span className="font-bold text-emerald-700">Seguro Escrow TuttiZelo Ativo</span>
              </div>
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
