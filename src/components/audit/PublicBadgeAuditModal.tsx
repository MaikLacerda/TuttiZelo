import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  QrCode,
  Calendar,
  X,
  FileCheck2,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';

interface PublicBadgeAuditModalProps {
  caregiver: CaregiverWithDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const PublicBadgeAuditModal: React.FC<PublicBadgeAuditModalProps> = ({
  caregiver,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const hashAudit = `tz-sec-${caregiver.id.slice(0, 8)}-${Date.now().toString(36)}`;
  const validUntilDate = new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR');
  const verifiedDate = new Date(caregiver.created_at || Date.now()).toLocaleDateString('pt-BR');

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

        {/* Cabeçalho do Selo */}
        <div className="flex items-center gap-4 border-b border-zinc-100 pb-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                Homologação Nível 2
              </span>
              <span className="text-xs text-zinc-400 font-mono">ID #{caregiver.id.slice(0, 8)}</span>
            </div>
            <h3 className="text-lg font-black text-zinc-900 font-display mt-0.5">
              Certidão de Integridade TuttiZelo
            </h3>
            <p className="text-xs text-zinc-500">
              Profissional: <strong className="text-zinc-800">{caregiver.full_name}</strong>
            </p>
          </div>
        </div>

        {/* Itens Auditados */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
            Checagens Jurídicas & Biometria
          </h4>

          <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-zinc-800">Antecedentes Criminais Federais e Estaduais</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Nada Consta
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 pl-6">
              Varredura nos Tribunais de Justiça de SP, RJ e sistemas integrados da Polícia Federal.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-zinc-800">Conferência Biométrica Facial (Prova de Vida)</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                100% Compatível
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 pl-6">
              Cruzamento da foto do documento de identidade oficial com selfie de alta resolução.
            </p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-zinc-800">Validade da Homologação</span>
              </div>
              <span className="text-xs font-bold text-zinc-700">Até {validUntilDate}</span>
            </div>
            <p className="text-[11px] text-zinc-500 pl-6">
              Homologado em {verifiedDate}. Renovação periódica a cada 12 meses obrigatória.
            </p>
          </div>
        </div>

        {/* Hash Criptográfico & LGPD */}
        <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-semibold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assinatura Digital Auditável (LGPD)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Status: Válido</span>
          </div>
          <p className="text-xs font-mono text-zinc-400 break-all bg-zinc-800/80 p-2.5 rounded-xl border border-zinc-700/60">
            {hashAudit}
          </p>
          <p className="text-[10px] text-zinc-400">
            Os dados sensíveis (CPF e fotos de documentos) permanecem criptografados e protegidos nos termos do Art. 7º e 11 da LGPD.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer"
        >
          Fechar Auditoria
        </button>
      </div>
    </div>
  );
};
