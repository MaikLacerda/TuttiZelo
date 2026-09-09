import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  DollarSign,
  Heart,
  ShieldCheck,
  Star,
  Repeat,
  FileText,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';

interface FamilyDashboardProps {
  onRehire: (caregiver: CaregiverWithDetails) => void;
  onViewDiscovery: () => void;
}

export const FamilyDashboard: React.FC<FamilyDashboardProps> = ({
  onRehire,
  onViewDiscovery,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  const mockPastShifts = [
    {
      id: 'sh-01',
      caregiverName: 'Dra. Camila Ribeiro',
      category: 'Enfermeira Geriatra',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813689-53b06385a420?w=400&auto=format&fit=crop&q=80',
      date: 'Ontem, 07 de Setembro',
      duration: '4 horas (14:00 às 18:00)',
      amount: 'R$ 64,00',
      status: 'Concluído & Avaliado',
      rating: 5,
    },
    {
      id: 'sh-02',
      caregiverName: 'Ana Beatriz Souza',
      category: 'Babá & Recreadora',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
      date: '02 de Setembro',
      duration: '6 horas (08:00 às 14:00)',
      amount: 'R$ 90,00',
      status: 'Concluído',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cabeçalho da Família */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-display">
                Olá, Família Oliveira!
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800">
                Conta Verificada
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Acompanhe seus plantões, recibos fiscais com custódia garantida e cuidadoras frequentes.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewDiscovery}
            className="px-5 py-2.5 rounded-xl bg-[#96382B] hover:bg-[#7D2E23] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <span>Contratar Novo Plantão</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Métricas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-1">
            <span className="text-xs text-zinc-500 font-medium">Total de Horas de Cuidado</span>
            <p className="text-2xl font-black text-zinc-900">42 horas</p>
            <span className="text-[10px] text-emerald-700 font-semibold">100% de plantões pontuais</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-1">
            <span className="text-xs text-zinc-500 font-medium">Total Investido (Via PIX Escrow)</span>
            <p className="text-2xl font-black text-[#96382B]">R$ 648,00</p>
            <span className="text-[10px] text-zinc-400">Protegido por seguro de responsabilidade</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-1">
            <span className="text-xs text-zinc-500 font-medium">Cuidadoras Salvas</span>
            <p className="text-2xl font-black text-zinc-900">3 profissionais</p>
            <span className="text-[10px] text-emerald-700 font-semibold">Homologadas Nível 2 e 3</span>
          </div>
        </div>

        {/* Histórico de Plantões */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <h3 className="text-lg font-black text-zinc-900 font-display">Histórico de Cuidados</h3>
            <span className="text-xs text-zinc-400 font-medium">Exibindo últimos plantões</span>
          </div>

          <div className="space-y-3">
            {mockPastShifts.map((shift) => (
              <div
                key={shift.id}
                className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 hover:bg-zinc-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={shift.avatarUrl}
                    alt={shift.caregiverName}
                    className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-zinc-900">{shift.caregiverName}</h4>
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500" /> {shift.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{shift.category}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      📅 {shift.date} • {shift.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-200">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-black text-zinc-900 block">{shift.amount}</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {shift.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onViewDiscovery}
                    className="px-3.5 py-2 rounded-xl border border-[#96382B] text-[#96382B] hover:bg-[#96382B]/5 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Recontratar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
