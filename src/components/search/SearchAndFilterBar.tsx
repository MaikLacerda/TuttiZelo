import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Filter,
  Sparkles,
  ShieldCheck,
  Baby,
  Heart,
  SlidersHorizontal,
  Check,
  Navigation,
} from 'lucide-react';
import { CaregiverCategory } from '../../types/database';

interface SearchAndFilterBarProps {
  onSearch: (filters: {
    category: string;
    city: string;
    need: string;
    specialty: string;
    ageGroup: string;
  }) => void;
  activeCategory: string;
  onCategoryChange: (category: CaregiverCategory | 'all') => void;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  onSearch,
  activeCategory,
  onCategoryChange,
}) => {
  const [city, setCity] = useState('São Paulo, SP');
  const [need, setNeed] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [radiusKm, setRadiusKm] = useState<number>(10);
  const [selectedRegion, setSelectedRegion] = useState<string>('todas');

  const handleSearch = () => {
    onSearch({
      category: activeCategory,
      city,
      need,
      specialty,
      ageGroup,
    });
  };

  const categories = [
    { id: 'all', label: 'Todos os Cuidados', icon: Sparkles },
    { id: 'babysitter', label: 'Babás & Recreação', icon: Baby },
    { id: 'elderly_care', label: 'Cuidado Sênior', icon: Heart },
    { id: 'pet_sitter', label: 'Pet Sitting', icon: Heart },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Category Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#96382B] text-white shadow-sm shadow-[#96382B]/20'
                  : 'bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Search Box */}
      <div className="bg-white rounded-2xl p-2 sm:p-3 shadow-md border border-zinc-200/80 flex flex-col md:flex-row items-stretch gap-2">
        <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-zinc-100 py-2 md:py-0">
          <MapPin className="w-4 h-4 text-[#96382B] shrink-0" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade ou Bairro"
            className="w-full text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex-1 flex items-center px-3 gap-2 border-b md:border-b-0 md:border-r border-zinc-100 py-2 md:py-0">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            placeholder="Necessidade (ex: plantão noturno, medicação)"
            className="w-full text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showFilters
                ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
            }`}
            title="Filtros avançados"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filtros</span>
          </button>

          <button
            type="button"
            onClick={handleSearch}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[#96382B] hover:bg-[#7D2E23] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Buscar</span>
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Especialidade / Treinamento */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Especialidade / Certificação</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-none focus:border-[#96382B]"
              >
                <option value="">Todas as especialidades</option>
                <option value="Primeiros Socorros">Primeiros Socorros</option>
                <option value="Alzheimer">Experiência com Alzheimer / Parkinson</option>
                <option value="Enfermagem">Formação em Enfermagem</option>
                <option value="Pedagogia">Pedagogia / Educação Infantil</option>
                <option value="Mobilidade Reduzida">Mobilidade Reduzida</option>
                <option value="Recém-nascidos">Recém-nascidos (0 a 12 meses)</option>
              </select>
            </div>

            {/* Faixa Etária (quando babá) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Faixa Etária Atendida</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-200 text-xs bg-white text-zinc-800 focus:outline-none focus:border-[#96382B]"
              >
                <option value="">Qualquer idade</option>
                <option value="baby">Bebês (0 a 1 ano)</option>
                <option value="toddler">Primeira Infância (1 a 3 anos)</option>
                <option value="preschool">Pré-escolar (3 a 6 anos)</option>
                <option value="school">Escolar (6+ anos)</option>
              </select>
            </div>

            {/* Raio de Atendimento & Região */}
            <div className="sm:col-span-2 pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#96382B]" />
                <span className="text-xs font-bold text-zinc-800">Raio de Proximidade:</span>
                <div className="flex gap-1.5">
                  {[5, 10, 20, 30].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => setRadiusKm(km)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        radiusKm === km
                          ? 'bg-[#96382B] text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      até {km} km
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 text-zinc-400" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-200 text-xs bg-white text-zinc-700 font-medium"
                >
                  <option value="todas">Todas as Regiões</option>
                  <option value="centro">Centro Expandido</option>
                  <option value="sul">Zona Sul (Moema, Brooklin, Pinheiros)</option>
                  <option value="oeste">Zona Oeste (Perdizes, Lapa, Butantã)</option>
                  <option value="norte">Zona Norte (Santana, Tucuruvi)</option>
                  <option value="leste">Zona Leste (Tatuapé, Mooca)</option>
                  <option value="alphaville">Alphaville / Barueri</option>
                  <option value="abc">Grande ABC</option>
                  <option value="rj_sul">Rio de Janeiro - Zona Sul</option>
                  <option value="rj_barra">Rio de Janeiro - Barra da Tijuca</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
