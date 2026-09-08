import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  Baby,
  Heart,
  Dog,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  X,
  MapPin,
  ChevronDown,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { CaregiverProfile, CaregiverBadge, CaregiverCategory } from '../../types/database';
import { CaregiverCard } from './CaregiverCard';
import { VerificationBadge } from '../brand/Badge';

interface CaregiverSearchProps {
  caregivers: (CaregiverProfile & {
    full_name: string;
    avatar_url: string;
    badges: CaregiverBadge;
    matchScore?: number;
  })[];
  onSelectCaregiver: (caregiver: any) => void;
  onInitiateHire: (caregiver: any) => void;
  initialCategory?: 'all' | CaregiverCategory;
  onOpenOnboarding?: () => void;
  onOpenPortal?: () => void;
}

export const CaregiverSearch: React.FC<CaregiverSearchProps> = ({
  caregivers,
  onSelectCaregiver,
  onInitiateHire,
  initialCategory = 'all',
  onOpenOnboarding,
  onOpenPortal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CaregiverCategory>(initialCategory);

  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);
  const [searchCity, setSearchCity] = useState('');
  const [selectedNeed, setSelectedNeed] = useState<string>('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxRate, setMaxRate] = useState<number>(100);

  // Filtragem dinâmica
  const filteredCaregivers = caregivers
    .filter((c) => {
      if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
      if (verifiedOnly && !c.badges.level_2_verified_at) return false;
      if (c.hourly_rate_cents > maxRate * 100) return false;
      if (searchCity && !c.city?.toLowerCase().includes(searchCity.toLowerCase())) return false;
      if (selectedSpecialty !== 'all' && !c.specialties.includes(selectedSpecialty)) return false;
      if (selectedAgeGroup !== 'all' && c.category === 'babysitter' && !c.age_groups.includes(selectedAgeGroup)) return false;
      return true;
    })
    .map((c) => {
      let score = 75;
      if (c.badges.level_3_verified_at) score += 15;
      if (c.badges.level_2_verified_at) score += 9;
      if (selectedSpecialty !== 'all' && c.specialties.includes(selectedSpecialty)) score += 5;
      return { ...c, matchScore: Math.min(score, 99) };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const specialtyOptions = {
    all: ['Primeiros Socorros', 'Recém-nascidos', 'Autismo (TEA)', 'Alzheimer / Demência', 'Mobilidade Reduzida', 'Cães Grande Porte', 'Medicação Oral'],
    babysitter: ['Recém-nascidos', 'Primeiros Socorros Infantil', 'Introdução Alimentar', 'Autismo (TEA)', 'Acompanhamento Escolar'],
    elderly_care: ['Alzheimer / Demência', 'Administração de Medicação', 'Mobilidade Reduzida / Cadeirantes', 'Pós-operatório', 'Sinais Vitais'],
    pet_sitter: ['Cães Grande Porte', 'Gatos Idosos', 'Medicação Oral', 'Adestramento Positivo', 'Passeio Educativo'],
  };

  const currentSpecialties = specialtyOptions[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Category Tabs: Babás, Idosos, Pets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
            selectedCategory === 'all'
              ? 'bg-[#96382B] text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Todos os Cuidadores</span>
          <span className="text-[11px] opacity-80">({caregivers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('babysitter')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
            selectedCategory === 'babysitter'
              ? 'bg-[#96382B] text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>Babás & Crianças</span>
          <span className="text-[11px] opacity-80">
            ({caregivers.filter((c) => c.category === 'babysitter').length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('elderly_care')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
            selectedCategory === 'elderly_care'
              ? 'bg-[#96382B] text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Cuidadores de Idosos</span>
          <span className="text-[11px] opacity-80">
            ({caregivers.filter((c) => c.category === 'elderly_care').length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('pet_sitter')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] ${
            selectedCategory === 'pet_sitter'
              ? 'bg-[#96382B] text-white shadow-xs'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Dog className="w-4 h-4" />
          <span>Pet Sitters & Dog Walkers</span>
          <span className="text-[11px] opacity-80">
            ({caregivers.filter((c) => c.category === 'pet_sitter').length})
          </span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          {onOpenPortal && (
            <button
              type="button"
              onClick={onOpenPortal}
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] bg-[#FDF6F4] text-[#96382B] hover:bg-[#F5D8D0] border border-[#F5D8D0] shadow-2xs"
            >
              <Wallet className="w-4 h-4" />
              <span>Minha Carteira</span>
            </button>
          )}

          {onOpenOnboarding && (
            <button
              type="button"
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer min-h-[44px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 shadow-2xs"
            >
              <UserPlus className="w-4 h-4 text-emerald-700" />
              <span>Quero Ser Cuidador(a)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar: City + Needs + Age + Verified Toggle */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* City search */}
          <div>
            <label htmlFor="city-search" className="text-xs font-semibold text-zinc-700 block mb-1">
              Cidade / Região
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="city-search"
                type="text"
                placeholder="Ex: São Paulo, Campinas..."
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
              />
            </div>
          </div>

          {/* Need type */}
          <div>
            <label htmlFor="need-filter" className="text-xs font-semibold text-zinc-700 block mb-1">
              Necessidade da Família
            </label>
            <select
              id="need-filter"
              value={selectedNeed}
              onChange={(e) => setSelectedNeed(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 bg-white focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B]"
            >
              <option value="all">Todas as disponibilidades</option>
              <option value="ocasional">Ocasional / Avulso</option>
              <option value="fds">Fins de Semana</option>
              <option value="integral">Período Integral</option>
              <option value="noturno">Noturno / Pernoite</option>
              <option value="emergencia">Emergência / Imediato</option>
            </select>
          </div>

          {/* Babysitter Age Group or Specialty */}
          <div>
            <label htmlFor="age-filter" className="text-xs font-semibold text-zinc-700 block mb-1">
              {selectedCategory === 'babysitter' ? 'Idade da Criança' : 'Especialidade Chave'}
            </label>
            {selectedCategory === 'babysitter' ? (
              <select
                id="age-filter"
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 bg-white focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B]"
              >
                <option value="all">Qualquer faixa etária</option>
                <option value="baby">Bebê / Recém-nascido (0 a 1 ano)</option>
                <option value="1_3">Primeira infância (1 a 3 anos)</option>
                <option value="4_6">Pré-escolar (4 a 6 anos)</option>
                <option value="7_plus">Crianças maiores (7+ anos)</option>
              </select>
            ) : (
              <select
                id="age-filter"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 bg-white focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B]"
              >
                <option value="all">Todas as especialidades</option>
                {currentSpecialties.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Max Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="rate-slider" className="text-xs font-semibold text-zinc-700">
                Valor Hora Máximo
              </label>
              <span className="text-xs font-bold text-[#96382B]">Até R$ {maxRate}/h</span>
            </div>
            <input
              id="rate-slider"
              type="range"
              min="25"
              max="100"
              step="5"
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full accent-[#96382B] cursor-pointer mt-2"
            />
          </div>
        </div>

        {/* Quick Filters Row: Only Verified toggle & Specialties Pills */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-zinc-100 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                verifiedOnly
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Apenas Perfil Verificado 🟢</span>
            </button>
          </div>

          <div className="text-xs text-zinc-500 font-medium">
            Mostrando <span className="font-bold text-zinc-900">{filteredCaregivers.length}</span> cuidadores
            ranqueados por curadoria e segurança
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredCaregivers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <ShieldCheck className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-zinc-800">Nenhum cuidador encontrado com esses filtros</h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1">
            Tente expandir o valor hora ou remover filtros de especialidade para ver mais profissionais verificados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSpecialty('all');
              setSelectedAgeGroup('all');
              setVerifiedOnly(false);
              setMaxRate(100);
              setSearchCity('');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-[#96382B] bg-[#FDF6F4] rounded-xl hover:bg-[#FBECE8] transition-colors cursor-pointer"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredCaregivers.map((caregiver) => (
            <CaregiverCard
              key={caregiver.id}
              caregiver={caregiver}
              onSelect={onSelectCaregiver}
              onInitiateHire={onInitiateHire}
            />
          ))}
        </div>
      )}
    </div>
  );
};
