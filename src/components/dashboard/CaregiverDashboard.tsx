import React, { useState } from 'react';
import {
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  FileText,
  UserCheck,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Lock,
  Download,
  TrendingUp,
  Star,
  QrCode,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { VerificationBadge } from '../brand/Badge';
import { tuttiZeloRepo } from '../../lib/supabase';

interface CaregiverDashboardProps {
  caregiver?: CaregiverWithDetails | null;
  onBackToDiscovery?: () => void;
  onPreviewPublicProfile?: () => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({
  caregiver,
  onBackToDiscovery,
  onPreviewPublicProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'shifts' | 'profile' | 'payouts'>('shifts');
  const [activePlantao, setActivePlantao] = useState<'idle' | 'checked_in' | 'completed'>('idle');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  const mockCaregiver = caregiver || {
    id: 'cg-mock-01',
    full_name: 'Dra. Camila Ribeiro',
    category: 'elderly_care' as const,
    headline: 'Enfermeira Geriatra • Pós-operatório & Alzheimer',
    hourly_rate_cents: 1600,
    rating: 4.98,
    reviews_count: 42,
    city: 'São Paulo',
    state: 'SP',
    avatar_url: 'https://images.unsplash.com/photo-1594824813689-53b06385a420?w=400&auto=format&fit=crop&q=80',
    badges: {
      level_1_verified_at: new Date().toISOString(),
      level_2_verified_at: new Date().toISOString(),
      level_3_verified_at: new Date().toISOString(),
    },
  };

  const handleCheckIn = () => {
    setActivePlantao('checked_in');
    setCheckInTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  const handleCheckOut = () => {
    setActivePlantao('completed');
    setCheckOutTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <div className="min-h-screen bg-[#FBF9F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header do Perfil */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <img
              src={mockCaregiver.avatar_url}
              alt={mockCaregiver.full_name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-display">
                  {mockCaregiver.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Homologada Nível 3
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500">{mockCaregiver.headline}</p>
              <p className="text-xs text-zinc-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#96382B]" />
                {mockCaregiver.city}, {mockCaregiver.state} • Tarifa: R${' '}
                {(mockCaregiver.hourly_rate_cents / 100).toFixed(2).replace('.', ',')}/hora
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {onPreviewPublicProfile && (
              <button
                type="button"
                onClick={onPreviewPublicProfile}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver Perfil Público</span>
              </button>
            )}
            {onBackToDiscovery && (
              <button
                type="button"
                onClick={onBackToDiscovery}
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#96382B] text-xs font-bold text-white hover:bg-[#7D2E23] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Explorar Famílias</span>
              </button>
            )}
          </div>
        </div>

        {/* Abas do Painel */}
        <div className="flex border-b border-zinc-200 gap-6 overflow-x-auto text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('shifts')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'shifts'
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Agenda de Plantões</span>
            <span className="px-1.5 py-0.2 bg-[#96382B]/10 text-[#96382B] rounded-full text-[10px] font-bold">1</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'payouts'
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Repasses & Custódia (PIX)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#96382B] text-[#96382B]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Desempenho</span>
          </button>
        </div>

        {/* CONTEÚDO DA ABA: AGENDA DE PLANTÕES */}
        {activeTab === 'shifts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-black text-zinc-900 font-display">Agenda & Plantões Ativos</h3>
                  <p className="text-xs text-zinc-500">Acompanhe custódia retida e execute check-in/out seguro.</p>
                </div>
              </div>

              {/* Card de Plantão Recente com Custódia Escrow */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-200 text-amber-900 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-900" /> Custódia Bloqueada (Escrow Seguro)
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">Reserva Confirmada</span>
                    </div>
                    <h4 className="text-base font-bold text-zinc-900">Família Contratante • Cuidados de Plantão</h4>
                    <p className="text-xs text-zinc-600 flex items-center gap-3 flex-wrap">
                      <span>📅 Hoje, das 14:00 às 18:00 (4 horas)</span>
                      <span>📍 Av. Paulista, 1000 - São Paulo, SP</span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right bg-white p-3 rounded-xl border border-amber-200 shadow-2xs">
                    <div className="text-[11px] text-zinc-500">Seu repasse garantido</div>
                    <div className="text-lg font-black text-emerald-700">R$ 57,60</div>
                    <div className="text-[10px] text-zinc-400">R$ 16,00/h (Líquido após taxa)</div>
                  </div>
                </div>

                {/* Status do Plantão & Ações */}
                <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-amber-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      {activePlantao === 'idle' && 'PIX da família recebido em custódia. Faça o Check-in no local.'}
                      {activePlantao === 'checked_in' && `Plantão em andamento! Check-in realizado às ${checkInTime}.`}
                      {activePlantao === 'completed' && `Plantão concluído às ${checkOutTime}! PIX de R$ 57,60 liberado.`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {activePlantao === 'idle' && (
                      <button
                        type="button"
                        onClick={handleCheckIn}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer shadow-xs"
                      >
                        Iniciar Plantão (Check-in)
                      </button>
                    )}
                    {activePlantao === 'checked_in' && (
                      <button
                        type="button"
                        onClick={handleCheckOut}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
                      >
                        Finalizar Plantão (Liberar PIX)
                      </button>
                    )}
                    {activePlantao === 'completed' && (
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Pago via PIX
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: REPASSES & PIX */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs space-y-6">
            <h3 className="text-lg font-black text-zinc-900 font-display">Repasses & Custódia Escrow</h3>
            <p className="text-xs text-zinc-500">
              Todos os pagamentos feitos pelas famílias são retidos pelo banco parceiro e transferidos via PIX instantâneo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Saldo em Custódia</span>
                <p className="text-2xl font-black text-zinc-900 mt-1">
                  {activePlantao === 'completed' ? 'R$ 0,00' : 'R$ 57,60'}
                </p>
                <span className="text-[10px] text-amber-700 font-medium">Aguardando término de plantão</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Repasses Realizados (Este Mês)</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">
                  {activePlantao === 'completed' ? 'R$ 1.897,60' : 'R$ 1.840,00'}
                </p>
                <span className="text-[10px] text-emerald-700 font-medium">32 plantões concluídos</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Chave PIX Cadastrada</span>
                <p className="text-sm font-bold text-zinc-800 mt-2 font-mono">123.456.789-00 (CPF)</p>
                <span className="text-[10px] text-zinc-400">Banco Itaú Unibanco</span>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO DA ABA: DESEMPENHO */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs space-y-4">
            <h3 className="text-lg font-black text-zinc-900 font-display">Métricas Profissionais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-zinc-200 flex items-center gap-3">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                <div>
                  <div className="text-xl font-bold text-zinc-900">4.98 / 5.0</div>
                  <div className="text-xs text-zinc-500">Avaliação média das famílias</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl border border-zinc-200 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="text-xl font-bold text-zinc-900">100% Homologada</div>
                  <div className="text-xs text-zinc-500">Certidões e biometria validadas</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
