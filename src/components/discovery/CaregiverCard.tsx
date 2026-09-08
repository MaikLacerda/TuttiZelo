import React from 'react';
import { Star, MapPin, Clock, Calendar, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';
import { CaregiverProfile, CaregiverBadge } from '../../types/database';
import { VerificationBadge } from '../brand/Badge';

interface CaregiverCardProps {
  caregiver: CaregiverProfile & {
    full_name: string;
    avatar_url: string;
    badges: CaregiverBadge;
    matchScore?: number;
  };
  onSelect: (caregiver: CaregiverCardProps['caregiver']) => void;
  onInitiateHire?: (caregiver: CaregiverCardProps['caregiver']) => void;
}

export const CaregiverCard: React.FC<CaregiverCardProps> = ({
  caregiver,
  onSelect,
  onInitiateHire,
}) => {
  const categoryLabels = {
    babysitter: 'Babá & Educadora Infantil',
    elderly_care: 'Cuidadora de Idosos / Geriatria',
    pet_sitter: 'Pet Sitter & Dog Walker',
  };

  const formattedRate = (caregiver.hourly_rate_cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <article
      className="bg-white rounded-2xl border border-zinc-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
      aria-labelledby={`caregiver-name-${caregiver.id}`}
    >
      <div className="p-5 sm:p-6">
        {/* Header: Photo + Name + Category + Match Score Badge */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={caregiver.avatar_url}
              alt={`Foto de perfil de ${caregiver.full_name}`}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white shadow-xs"
              loading="lazy"
            />
            {caregiver.badges.level_2_verified_at && (
              <span
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs"
                title="Antecedentes Verificados (Nível 2)"
                aria-label="Selo de antecedentes criminais verificado"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3
                id={`caregiver-name-${caregiver.id}`}
                className="text-base sm:text-lg font-bold text-zinc-900 truncate group-hover:text-[#96382B] transition-colors"
              >
                {caregiver.full_name}
              </h3>
              {caregiver.matchScore !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]">
                  <span>{caregiver.matchScore}%</span>
                  <span className="text-[10px] font-medium text-[#FA7C64]">Match</span>
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-zinc-500 mt-0.5">
              {categoryLabels[caregiver.category]}
            </p>

            {/* Rating & City */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600 flex-wrap">
              <div className="flex items-center gap-1 font-semibold text-zinc-800">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{caregiver.rating?.toFixed(2) || '5.00'}</span>
                <span className="text-zinc-400 font-normal">({caregiver.reviews_count || 0})</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1 text-zinc-500">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>
                  {caregiver.city}, {caregiver.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Badges Row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-zinc-100">
          {caregiver.badges.level_1_verified_at && (
            <VerificationBadge level="level_1_identity" />
          )}
          {caregiver.badges.level_2_verified_at && (
            <VerificationBadge level="level_2_background" />
          )}
          {caregiver.badges.level_3_verified_at && (
            <VerificationBadge level="level_3_plus" />
          )}
        </div>

        {/* Headline / Bio Snippet */}
        <p className="text-xs sm:text-sm text-zinc-600 mt-3 line-clamp-2 leading-relaxed">
          {caregiver.headline || caregiver.bio}
        </p>

        {/* Specialties Chips */}
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {caregiver.specialties.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700"
            >
              {spec}
            </span>
          ))}
          {caregiver.specialties.length > 3 && (
            <span className="inline-block px-1.5 py-0.5 rounded-md text-[11px] font-medium text-zinc-400">
              +{caregiver.specialties.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Price + Action Button */}
      <div className="px-5 py-3.5 sm:px-6 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-zinc-500 block">Valor hora</span>
          <span className="text-base font-extrabold text-zinc-900">
            {formattedRate}
            <span className="text-xs font-normal text-zinc-500">/h</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(caregiver)}
            className="px-3 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer min-h-[40px]"
          >
            Ver Detalhes
          </button>
          <button
            type="button"
            onClick={() => onInitiateHire ? onInitiateHire(caregiver) : onSelect(caregiver)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <span>Contratar</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
