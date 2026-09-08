import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Eye,
  UserCheck,
  Scale,
  Calendar,
  Lock,
  FileText,
  Building,
} from 'lucide-react';
import {
  VerificationCase,
  VerificationState,
  VerificationLevel,
  CheckType,
  Consent,
} from '../../types/database';
import { StateBadge, VerificationBadge } from '../brand/Badge';
import { tuttiZeloRepo } from '../../lib/supabase';

interface VerificationStateMachineProps {
  cases: (VerificationCase & {
    checks: any[];
    events: any[];
    dispute?: any;
  })[];
  onStateChangeSuccess: () => void;
}

export const VerificationStateMachine: React.FC<VerificationStateMachineProps> = ({
  cases,
  onStateChangeSuccess,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actorKind, setActorKind] = useState<'reviewer' | 'system' | 'caregiver'>('reviewer');
  const [activeTab, setActiveTab] = useState<'machine' | 'checks' | 'events' | 'lgpd'>('machine');

  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const consents = tuttiZeloRepo.getConsents();

  // Possíveis transições válidas no SQL
  const validTransitionsMap: Record<VerificationState, VerificationState[]> = {
    pending_consent: ['awaiting_input', 'expired', 'revoked'],
    awaiting_input: ['submitted', 'expired', 'revoked'],
    submitted: ['in_progress', 'failed', 'expired', 'revoked'],
    in_progress: ['approved', 'manual_review', 'failed', 'revoked'],
    manual_review: ['approved', 'rejected', 'disputed', 'revoked'],
    disputed: ['approved', 'rejected', 'expired', 'revoked'],
    failed: ['awaiting_input', 'submitted', 'revoked'],
    approved: ['expired', 'revoked'],
    rejected: ['disputed', 'awaiting_input', 'revoked'],
    expired: ['awaiting_input', 'revoked'],
    revoked: [],
  };

  const currentValidTransitions = currentCase ? validTransitionsMap[currentCase.state] || [] : [];

  const handleTransition = (targetState: VerificationState) => {
    setActionError(null);
    setActionSuccess(null);

    const res = tuttiZeloRepo.transitionVerificationState(
      currentCase.id,
      targetState,
      actorKind,
      `Transição acionada via console interativo TuttiZelo como [${actorKind}]`
    );

    if (!res.success) {
      setActionError(res.error || 'Erro na transição');
    } else {
      setActionSuccess(`Transição para ${targetState} realizada com sucesso! Evento persistido no log append-only.`);
      onStateChangeSuccess();
    }
  };

  const checkTypeLabels: Record<CheckType, { name: string; icon: React.ReactNode; authority: string }> = {
    cpf_status: { name: 'Status do CPF', icon: <UserCheck className="w-4 h-4 text-sky-600" />, authority: 'Receita Federal / Serpro' },
    document_ocr: { name: 'OCR & Validação de Documento', icon: <FileCheck2 className="w-4 h-4 text-indigo-600" />, authority: 'Bureau / CNH Digital' },
    liveness_selfie: { name: 'Prova de Vida (Liveness 3D)', icon: <Eye className="w-4 h-4 text-purple-600" />, authority: 'SDK Biometria Facial' },
    criminal_federal: { name: 'Certidão Criminal Federal', icon: <Scale className="w-4 h-4 text-emerald-600" />, authority: 'Polícia Federal (SINIC)' },
    criminal_state: { name: 'Certidão Criminal Estadual (TJs)', icon: <Building className="w-4 h-4 text-emerald-600" />, authority: 'Tribunais de Justiça (UFs resididas)' },
    bnmp: { name: 'Banco Nac. de Mandados de Prisão', icon: <Lock className="w-4 h-4 text-rose-600" />, authority: 'Conselho Nacional de Justiça (CNJ)' },
    reference_call: { name: 'Checagem de Referências Anteriores', icon: <FileText className="w-4 h-4 text-amber-600" />, authority: 'Auditoria TuttiZelo' },
    course_certificate: { name: 'Certificado de Cursos / Especialização', icon: <FileCheck2 className="w-4 h-4 text-teal-600" />, authority: 'Instituição de Ensino' },
    first_aid_certificate: { name: 'Certificado de Primeiros Socorros', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, authority: 'Cruz Vermelha / SAMU / Cursos Certificados' },
  };

  return (
    <div className="space-y-6">
      {/* Header & Case Selector */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#FDF6F4] text-[#96382B]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-display">
                Máquina de Estados de Verificação & Auditoria
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Executando com base no schema PostgreSQL + triggers de transição de estado da Fase 1.
            </p>
          </div>

          {/* Select Case */}
          <div className="flex items-center gap-3">
            <label htmlFor="case-select" className="text-xs font-semibold text-zinc-600 shrink-0">
              Caso em Análise:
            </label>
            <select
              id="case-select"
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-300 bg-white text-zinc-800 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B]"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id} — {c.level} ({c.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Case Quick Banner */}
        {currentCase && (
          <div className="mt-5 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <VerificationBadge level={currentCase.level} />
              <StateBadge state={currentCase.state} />
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-600">
              <div>
                <span className="text-zinc-400">Custo Total:</span>{' '}
                <span className="font-bold text-zinc-800">
                  {(currentCase.cost_cents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div>
                <span className="text-zinc-400">Bureau Parceiro:</span>{' '}
                <span className="font-semibold text-zinc-800">{currentCase.provider || 'Interno / Direto'}</span>
              </div>
              {currentCase.valid_until && (
                <div>
                  <span className="text-zinc-400">Validade do Selo:</span>{' '}
                  <span className="font-semibold text-emerald-700">
                    Até {new Date(currentCase.valid_until).toLocaleDateString('pt-BR')} (12 meses)
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tabs: Machine / Checks / Audit Events / LGPD */}
      <div className="flex border-b border-zinc-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('machine')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'machine'
              ? 'border-[#96382B] text-[#96382B]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Simulador da Máquina de Estados
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('checks')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'checks'
              ? 'border-[#96382B] text-[#96382B]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Checagens & Certidões ({currentCase?.checks?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'events'
              ? 'border-[#96382B] text-[#96382B]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Trilha de Auditoria Append-Only ({currentCase?.events?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lgpd')}
          className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'lgpd'
              ? 'border-[#96382B] text-[#96382B]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          LGPD & Consentimentos
        </button>
      </div>

      {/* TAB 1: Simulator & Transition Tester */}
      {activeTab === 'machine' && currentCase && (
        <div className="space-y-5">
          {/* Visual Workflow Steps */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-zinc-800 mb-4 flex items-center justify-between">
              <span>Fluxo de Estados Regrado pelo Banco de Dados</span>
              <span className="text-xs font-normal text-zinc-500">
                Disparado por triggers PostgreSQL na tabela <code>verification_cases</code>
              </span>
            </h3>

            {/* Pipeline Step Sequence */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { state: 'pending_consent', label: '1. Consentimento' },
                { state: 'awaiting_input', label: '2. Upload Docs' },
                { state: 'submitted', label: '3. Submetido' },
                { state: 'in_progress', label: '4. Consultas TJs' },
                { state: 'manual_review', label: '5. Revisão' },
                { state: 'approved', label: '6. Aprovado 🟢' },
                { state: 'disputed', label: '7. Contestação' },
              ].map((step) => {
                const isActive = currentCase.state === step.state;
                return (
                  <div
                    key={step.state}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'bg-[#FDF6F4] border-[#96382B] ring-2 ring-[#96382B]/20 shadow-xs'
                        : 'bg-zinc-50/70 border-zinc-200 text-zinc-500'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">{step.label}</div>
                    <div className="text-[10px] mt-1 capitalize opacity-80">
                      {isActive ? '● Estado Atual' : step.state.replace('_', ' ')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* State Transition Controller */}
            <div className="mt-6 pt-5 border-t border-zinc-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    Transições Permitidas a partir de:{' '}
                    <span className="text-[#96382B]">{currentCase.state}</span>
                  </h4>
                  <p className="text-xs text-zinc-500">
                    A máquina de estados rejeitará transições não autorizadas pela função SQL{' '}
                    <code>is_valid_verification_transition</code>.
                  </p>
                </div>

                {/* Actor kind */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-600 font-semibold">Ator:</span>
                  <select
                    value={actorKind}
                    onChange={(e) => setActorKind(e.target.value as any)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-zinc-300 bg-white font-medium text-zinc-700"
                  >
                    <option value="reviewer">Revisor / Auditor Humano</option>
                    <option value="system">Sistema / Webhook Bureau</option>
                    <option value="caregiver">Cuidador (Usuário)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {currentValidTransitions.map((target) => {
                  const isPositive = target === 'approved';
                  const isNegative = target === 'rejected' || target === 'failed';
                  return (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handleTransition(target)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer min-h-[40px] ${
                        isPositive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : isNegative
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : 'bg-zinc-800 hover:bg-zinc-900 text-white'
                      }`}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Mudar para: {target}</span>
                    </button>
                  );
                })}

                {/* Attempt Invalid Transition (to test SQL trigger integrity) */}
                <button
                  type="button"
                  onClick={() => handleTransition('approved')}
                  disabled={currentValidTransitions.includes('approved')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 bg-zinc-100 hover:bg-zinc-200 border border-dashed border-zinc-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed min-h-[40px]"
                  title="Testar se a trigger bloqueia transições ilegais"
                >
                  ⚡ Testar Transição Proibida
                </button>
              </div>

              {/* Notifications */}
              {actionError && (
                <div
                  role="alert"
                  className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Bloqueio de Regra: {actionError}</span>
                </div>
              )}

              {actionSuccess && (
                <div
                  role="status"
                  className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Checks & Background queries */}
      {activeTab === 'checks' && currentCase && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-zinc-900 mb-1">
            Consultas e Certidões do Caso ({currentCase.checks.length})
          </h3>
          <p className="text-xs text-zinc-500 mb-4">
            Cada checagem possui custo unitário, autoridade consultada e tempo de retorno.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-semibold">
                  <th className="pb-3">Tipo de Checagem</th>
                  <th className="pb-3">Autoridade / Órgão</th>
                  <th className="pb-3">Jurisdição (UF)</th>
                  <th className="pb-3">Resultado</th>
                  <th className="pb-3">Custo</th>
                  <th className="pb-3">Completado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {currentCase.checks.map((chk) => {
                  const info = checkTypeLabels[chk.check_type as CheckType] || {
                    name: chk.check_type,
                    icon: <FileCheck2 className="w-4 h-4" />,
                    authority: 'Bureau',
                  };
                  return (
                    <tr key={chk.id} className="hover:bg-zinc-50/50">
                      <td className="py-3 font-semibold text-zinc-900 flex items-center gap-2">
                        {info.icon}
                        <span>{info.name}</span>
                      </td>
                      <td className="py-3 text-zinc-600">{chk.provider || info.authority}</td>
                      <td className="py-3">
                        {chk.jurisdiction ? (
                          <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-zinc-700 font-bold">
                            {chk.jurisdiction}
                          </span>
                        ) : (
                          <span className="text-zinc-400">Nacional</span>
                        )}
                      </td>
                      <td className="py-3">
                        {chk.result === 'clear' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>CLEAR (Nada Consta)</span>
                          </span>
                        ) : chk.result === 'pending' ? (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pendente</span>
                          </span>
                        ) : (
                          <span className="text-rose-700 font-bold">{chk.result}</span>
                        )}
                      </td>
                      <td className="py-3 text-zinc-600 font-mono">
                        {(chk.cost_cents / 100).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </td>
                      <td className="py-3 text-zinc-500">
                        {chk.completed_at
                          ? new Date(chk.completed_at).toLocaleString('pt-BR')
                          : 'Em processamento'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Events */}
      {activeTab === 'events' && currentCase && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Log de Auditoria Imutável (Append-Only)
              </h3>
              <p className="text-xs text-zinc-500">
                Protegido por trigger <code>forbid_event_mutation</code> que proíbe DELETE e UPDATE.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-700">
              {currentCase.events.length} Eventos Gravados
            </span>
          </div>

          <div className="space-y-3">
            {currentCase.events.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50/60 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-500">#{evt.id}</span>
                    <span className="text-xs font-bold text-zinc-900">
                      {evt.from_state || 'início'} ➔ {evt.to_state}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold bg-zinc-200 text-zinc-700">
                      {evt.actor_kind}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">{evt.reason}</p>
                </div>
                <div className="text-[11px] text-zinc-400 whitespace-nowrap">
                  {new Date(evt.created_at).toLocaleTimeString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LGPD Consents */}
      {activeTab === 'lgpd' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Consentimentos Granulares Versionados (LGPD Art. 7º e 11)
            </h3>
            <p className="text-xs text-zinc-500">
              Dados sensíveis são segregados no bucket <code>verification-private</code> e certidões brutas nunca
              são exibidas aos contratantes, garantindo conformidade jurídica estrita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {consents.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 capitalize">
                    {c.purpose.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Ativo
                  </span>
                </div>
                <div className="text-xs text-zinc-600 space-y-1">
                  <div>
                    <span className="text-zinc-400">Versão da Política:</span>{' '}
                    <span className="font-mono font-semibold text-zinc-700">{c.policy_version}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">IP Registrado:</span>{' '}
                    <span className="font-mono text-zinc-600">{c.ip_address}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Data do Aceite:</span>{' '}
                    <span>{new Date(c.granted_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 7 Business days dispute info */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>Garantia de Ampla Defesa (Prazo de Contestação: 7 Dias Úteis)</span>
            </div>
            <p className="leading-relaxed">
              Calculado dinamicamente pela função PostgreSQL <code>public.add_business_days()</code>, excluindo
              finais de semana e a tabela de feriados nacionais <code>public.holidays</code>. Em caso de
              homonímia ou certidão positiva indevida, o cuidador tem 7 dias úteis para juntar certidão
              explicativa antes de qualquer revogação de selo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
