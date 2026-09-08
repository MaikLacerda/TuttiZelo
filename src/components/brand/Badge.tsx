import React from 'react';
import { ShieldCheck, CheckCircle2, Award, AlertCircle } from 'lucide-react';
import { VerificationLevel, VerificationState } from '../../types/database';

interface VerificationBadgeProps {
  level: VerificationLevel;
  state?: VerificationState;
  showDetails?: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level,
  state = 'approved',
  showDetails = false,
  className = '',
}) => {
  if (level === 'level_1_identity') {
    return (
      <span
        role="status"
        aria-label="Identidade e CPF verificados na Receita Federal com biometria facial"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 transition-colors ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" aria-hidden="true" />
        <span>Nível 1 · Identidade</span>
        {showDetails && <span className="text-[10px] text-sky-600 ml-0.5">(CPF + OCR)</span>}
      </span>
    );
  }

  if (level === 'level_2_background') {
    return (
      <span
        role="status"
        aria-label="Perfil verificado com antecedentes criminais federais e estaduais limpos"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs transition-colors ${className}`}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Verificado 🟢</span>
        </span>
        {showDetails && <span className="text-[10px] text-emerald-700 ml-0.5">(Antecedentes OK)</span>}
      </span>
    );
  }

  // Level 3+
  return (
    <span
      role="status"
      aria-label="Perfil com qualificação avançada em primeiros socorros e cursos auditados"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 transition-colors ${className}`}
    >
      <Award className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
      <span>Nível 3+ · Excelência ⭐</span>
      {showDetails && <span className="text-[10px] text-amber-700 ml-0.5">(1º Socorros + Cursos)</span>}
    </span>
  );
};

export const StateBadge: React.FC<{ state: VerificationState; className?: string }> = ({
  state,
  className = '',
}) => {
  const stateMap: Record<VerificationState, { label: string; color: string; icon: React.ReactNode }> = {
    pending_consent: {
      label: 'Aguardando Consentimento',
      color: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />,
    },
    awaiting_input: {
      label: 'Aguardando Documentos',
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />,
    },
    submitted: {
      label: 'Documentos Enviados',
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
    },
    in_progress: {
      label: 'Consultas em Progresso',
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-1" />,
    },
    manual_review: {
      label: 'Revisão Manual / Auditor',
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-purple-600" />,
    },
    approved: {
      label: 'Aprovado / Vigente',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
    },
    rejected: {
      label: 'Reprovado',
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
    failed: {
      label: 'Falha Técnica',
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-orange-600" />,
    },
    disputed: {
      label: 'Em Contestação (7 dias úteis)',
      color: 'bg-yellow-50 text-yellow-900 border-yellow-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-yellow-600" />,
    },
    expired: {
      label: 'Selo Expirado',
      color: 'bg-zinc-100 text-zinc-600 border-zinc-200',
      icon: <AlertCircle className="w-3.5 h-3.5 text-zinc-400" />,
    },
    revoked: {
      label: 'Selo Revogado',
      color: 'bg-red-100 text-red-900 border-red-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-red-700" />,
    },
  };

  const item = stateMap[state] || {
    label: state,
    color: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${item.color} ${className}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
