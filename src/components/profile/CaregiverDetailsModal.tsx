import React from 'react';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Calendar,
  Heart,
  CheckCircle2,
  X,
  Sparkles,
  Award,
  DollarSign,
  FileCheck2,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';

interface CaregiverDetailsModalProps {
  caregiver: CaregiverWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onHire: () => void;
}

export const CaregiverDetailsModal: React.FC<CaregiverDetailsModalProps> = ({
  caregiver,
  isOpen,
  onClose,
  onHire,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Perfil & Cabeçalho */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-zinc-100 pb-6">
          <img
            src={caregiver.avatar_url}
            alt={caregiver.full_name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-white shadow-md shrink-0"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-display">
                {caregiver.full_name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Nível 2 Verificado
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-zinc-600">{caregiver.headline}</p>
            <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1 text-zinc-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#96382B]" /> {caregiver.city}, {caregiver.state}
              </span>
              <span className="text-amber-500 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500" /> {caregiver.rating || 4.9} ({caregiver.reviews_count || 32} avaliações)
              </span>
              <span className="text-zinc-500">
                {caregiver.years_experience || 5} anos de experiência
              </span>
            </div>
          </div>
        </div>

        {/* Biografia & Experiência */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Sobre a Profissional</h3>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed bg-zinc-50/70 p-4 rounded-2xl border border-zinc-100">
            {caregiver.bio}
          </p>
        </div>

        {/* Especialidades e Selos */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">Especialidades Homologadas</h3>
          <div className="flex flex-wrap gap-2">
            {caregiver.specialties?.map((spec, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Garantia TuttiZelo */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
          <div className="space-y-0.5 text-xs text-emerald-950">
            <span className="font-bold block">Plantão Seguro com Custódia Escrow</span>
            <p className="text-[11px] text-emerald-800 leading-normal">
              Ao agendar, seu pagamento só é repassado após o check-out presencial. Em caso de imprevistos, cobertura imediata pelo Seguro TuttiZelo.
            </p>
          </div>
        </div>

        {/* Rodapé de Ação */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
          <div>
            <span className="text-[11px] text-zinc-400 font-medium block">Valor por hora</span>
            <span className="text-xl font-black text-zinc-900">
              R$ {((caregiver.hourly_rate_cents || 1500) / 100).toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onHire();
            }}
            className="px-6 py-3 rounded-2xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Contratar Plantão Seguro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
