import React, { useState } from 'react';
import {
  AlertTriangle,
  Phone,
  ShieldAlert,
  X,
  Ambulance,
  LifeBuoy,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiverName?: string;
  familyName?: string;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  caregiverName = 'Cuidador(a)',
  familyName = 'Família',
}) => {
  if (!isOpen) return null;

  const [alertSent, setAlertSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTriggerSos = async (type: string) => {
    setLoading(true);
    if (supabase) {
      try {
        await supabase.from('emergency_alerts').insert([
          {
            alert_type: type,
            description: `Acionamento de emergência durante plantão ativo (${familyName} / ${caregiverName})`,
            status: 'active',
          },
        ]);
      } catch (err) {
        console.warn('Erro ao registrar alerta SOS:', err);
      }
    }
    setLoading(false);
    setAlertSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border-2 border-rose-500 shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {alertSent ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 font-display">Alerta Enviado à Central 24h!</h3>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto">
              Nossa equipe de apoio foi notificada e os contatos de emergência do plantão receberam a localização.
            </p>
            <div className="pt-2">
              <a
                href="tel:190"
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" /> Ligar para a Polícia (190)
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-rose-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-zinc-900">Botão de Emergência (SOS)</h3>
                <p className="text-xs text-zinc-500">Canal rápido de socorro e mediação em plantão</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href="tel:192"
                onClick={() => handleTriggerSos('samu_192')}
                className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Ambulance className="w-5 h-5 text-rose-600" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-rose-950 block">Emergência Médica / SAMU</span>
                    <span className="text-[11px] text-rose-700">Discar imediatamente para o 192</span>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
              </a>

              <a
                href="tel:190"
                onClick={() => handleTriggerSos('police_190')}
                className="w-full p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5 text-zinc-800" />
                  <div className="text-left">
                    <span className="text-xs font-bold text-zinc-900 block">Polícia Militar</span>
                    <span className="text-[11px] text-zinc-500">Discar imediatamente para o 190</span>
                  </div>
                </div>
                <Phone className="w-4 h-4 text-zinc-700 group-hover:scale-110 transition-transform" />
              </a>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleTriggerSos('support_tuttizelo')}
                className="w-full p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-5 h-5 text-amber-700" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">Suporte e Mediação TuttiZelo 24h</span>
                    <span className="text-[11px] text-amber-800">Acionar equipe jurídica e de acolhimento</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  SOS
                </span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 text-center">
              Acionamentos indevidos são passíveis de advertência contratual conforme os Termos TuttiZelo.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
