import React, { useState } from 'react';
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
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { supabase } from '../../lib/supabase';

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

  // Cálculos financeiros em centavos
  const rateCents = caregiver.hourly_rate_cents || 1500;
  const subtotalCents = rateCents * hours;
  const platformFeeCents = Math.round(subtotalCents * 0.12); // Taxa de 12% para seguro e custódia
  const totalCents = subtotalCents + platformFeeCents;

  const pixCode = `00020126580014br.gov.bcb.pix0136${caregiver.id}520400005303986540${(
    totalCents / 100
  ).toFixed(2)}5802BR5925TUTTIZELO CUSTODIA SEGUR6009SAO PAULO62070503***6304`;

  const handleConfirmBooking = async () => {
    setLoading(true);
    if (supabase) {
      try {
        await supabase.from('hirings').insert([
          {
            caregiver_id: caregiver.id,
            family_name: 'Família Contratante',
            hours,
            hourly_rate_cents: rateCents,
            total_cents: totalCents,
            status: 'escrow_hold',
            start_time: `${date}T${startTime}:00Z`,
          },
        ]);
      } catch (err) {
        console.warn('Erro ao registrar contratação:', err);
      }
    }
    setLoading(false);
    setStep('payment');
  };

  const copyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

        {/* ETAPA 1: Detalhes do Plantão */}
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
                <span>Mínimo: 2h</span>
                <span>Máximo: 12h</span>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Cuidado ({hours} horas):</span>
                <span>R$ {(subtotalCents / 100).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span className="flex items-center gap-1">
                  Seguro TuttiZelo + Custódia Escrow:
                </span>
                <span>R$ {(platformFeeCents / 100).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="border-t border-zinc-200 pt-2 flex justify-between font-black text-sm text-zinc-900">
                <span>Total Garantido:</span>
                <span className="text-[#96382B]">
                  R$ {(totalCents / 100).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                O valor fica <strong>100% protegido em custódia</strong> e só é pago à cuidadora após você confirmar a realização do serviço.
              </span>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmBooking}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>Prosseguir para Pagamento Seguro via PIX</span>
            </button>
          </div>
        )}

        {/* ETAPA 2: Pagamento PIX com Custódia Escrow */}
        {step === 'payment' && (
          <div className="space-y-5 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-zinc-900 font-display">Pague via PIX Dinâmico</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                O valor de <strong>R$ {(totalCents / 100).toFixed(2).replace('.', ',')}</strong> será retido com segurança na TuttiZelo.
              </p>
            </div>

            {/* Código PIX Copia e Cola */}
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase font-mono block">Chave PIX Copia e Cola</span>
              <p className="text-[10px] font-mono text-zinc-600 truncate bg-white p-2 rounded-lg border border-zinc-200">
                {pixCode}
              </p>
              <button
                type="button"
                onClick={copyPix}
                className="w-full py-2 bg-white border border-zinc-300 hover:bg-zinc-100 text-xs font-bold text-zinc-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copiado com Sucesso!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Código PIX</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep('confirmed')}
              className="w-full py-3.5 rounded-xl font-bold text-xs text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simular Pagamento Confirmado</span>
            </button>
          </div>
        )}

        {/* ETAPA 3: Plantão Confirmado */}
        {step === 'confirmed' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-900 font-display">Plantão Agendado & Seguro Ativo!</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                A cuidadora <strong>{caregiver.full_name}</strong> recebeu a notificação com os detalhes do plantão.
              </p>
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-zinc-500">Data:</span>
                <span className="font-bold text-zinc-800">{date} às {startTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Duração:</span>
                <span className="font-bold text-zinc-800">{hours} horas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Status Custódia:</span>
                <span className="font-bold text-emerald-700">Bloqueado em Segurança</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer"
            >
              Concluir e Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
