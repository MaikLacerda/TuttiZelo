import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  DollarSign,
  Heart,
  Baby,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  Star,
  UserCheck,
  ChevronRight,
  FileCheck2,
  Lock,
  MessageCircle,
  HelpCircle,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { CaregiverWithDetails, CaregiverCategory } from './types/database';
import { tuttiZeloRepo } from './lib/supabase';
import { Logo } from './components/brand/Logo';
import { LandingPage } from './components/landing/LandingPage';
import { HireCaregiverModal } from './components/booking/HireCaregiverModal';
import { SearchAndFilterBar } from './components/search/SearchAndFilterBar';
import { CaregiverDetailsModal } from './components/profile/CaregiverDetailsModal';
import { VerificationBadge } from './components/brand/Badge';
import { CaregiverOnboarding } from './components/workflow/CaregiverOnboarding';
import { CaregiverDashboard } from './components/dashboard/CaregiverDashboard';
import { FamilyDashboard } from './components/dashboard/FamilyDashboard';
import { PublicBadgeAuditModal } from './components/audit/PublicBadgeAuditModal';
import { ShiftChatAndNotesModal } from './components/chat/ShiftChatAndNotesModal';
import { ReviewModal } from './components/reviews/ReviewModal';
import { EmergencySosModal } from './components/safety/EmergencySosModal';
import { NotificationCenter } from './components/notifications/NotificationCenter';

const DEFAULT_CAREGIVERS: CaregiverWithDetails[] = [
  {
    id: 'cg-01',
    full_name: 'Dra. Camila Ribeiro',
    category: 'elderly_care',
    headline: 'Enfermeira Geriatra • Pós-operatório & Alzheimer',
    bio: 'Especialista em cuidados intensivos e terceira idade. 8 anos de experiência em ambiente hospitalar e domiciliar.',
    birth_date: '1988-04-12',
    city: 'São Paulo',
    state: 'SP',
    hourly_rate_cents: 3500,
    rating: 4.98,
    reviews_count: 42,
    avatar_url: 'https://images.unsplash.com/photo-1594824813689-53b06385a420?w=400&auto=format&fit=crop&q=80',
    specialties: ['Alzheimer / Parkinson', 'Administração de Medicação', 'Mobilidade Reduzida'],
    years_experience: 8,
    badges: { level_1_verified_at: new Date().toISOString(), level_2_verified_at: new Date().toISOString(), level_3_verified_at: new Date().toISOString() },
  },
  {
    id: 'cg-02',
    full_name: 'Ana Beatriz Souza',
    category: 'babysitter',
    headline: 'Pedagoga e Babá Folguista • Primeiros Socorros',
    bio: 'Formada em Pedagogia pela USP com certificação de primeiros socorros infantil pela Cruz Vermelha.',
    birth_date: '1995-09-20',
    city: 'São Paulo',
    state: 'SP',
    hourly_rate_cents: 3000,
    rating: 4.95,
    reviews_count: 28,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    specialties: ['Primeiros Socorros Infantil', 'Recém-nascidos', 'Atividades Lúdicas'],
    years_experience: 5,
    badges: { level_1_verified_at: new Date().toISOString(), level_2_verified_at: new Date().toISOString() },
  },
  {
    id: 'cg-03',
    full_name: 'Marcos Vinicius Lima',
    category: 'pet_sitter',
    headline: 'Biólogo & Cuidador de Pets Especiais',
    bio: 'Atendimento humanizado para cães idosos, medicação oral e passeios educativos.',
    birth_date: '1992-02-14',
    city: 'São Paulo',
    state: 'SP',
    hourly_rate_cents: 2500,
    rating: 4.92,
    reviews_count: 19,
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    specialties: ['Cães Idosos', 'Medicação Oral', 'Adestramento Positivo'],
    years_experience: 4,
    badges: { level_1_verified_at: new Date().toISOString(), level_2_verified_at: new Date().toISOString() },
  },
];

export function App() {
  const [activeView, setActiveView] = useState<'landing' | 'discovery' | 'family-dash' | 'caregiver-dash' | 'onboarding'>('landing');
  const [caregivers, setCaregivers] = useState<CaregiverWithDetails[]>(DEFAULT_CAREGIVERS);
  const [loading, setLoading] = useState(true);
  const [selectedCaregiver, setSelectedCaregiver] = useState<CaregiverWithDetails | null>(null);
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'babysitter' | 'elderly_care' | 'pet_sitter'>('all');

  // Modais Auxiliares
  const [auditModalCaregiver, setAuditModalCaregiver] = useState<CaregiverWithDetails | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [chatModalCaregiver, setChatModalCaregiver] = useState<CaregiverWithDetails | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [reviewModalCaregiver, setReviewModalCaregiver] = useState<CaregiverWithDetails | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await tuttiZeloRepo.getCaregivers();
        if (data && data.length > 0) {
          setCaregivers(data);
        } else {
          setCaregivers(DEFAULT_CAREGIVERS);
        }
      } catch (err) {
        console.warn('Usando dados mockados locais:', err);
        setCaregivers(DEFAULT_CAREGIVERS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCaregivers = caregivers.filter((c) => {
    if (activeTab === 'all') return true;
    return c.category === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#FBF9F8] text-zinc-900 flex flex-col font-sans">
      {/* Barra de Navegação Superior com Logo Oficial */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBDCD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <Logo size="md" />
          </div>

          {/* Navegação entre Visões */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveView('landing')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'landing'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Início
            </button>
            <button
              type="button"
              onClick={() => setActiveView('discovery')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'discovery'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Explorar Cuidadoras
            </button>
            <button
              type="button"
              onClick={() => setActiveView('family-dash')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'family-dash'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Minha Família
            </button>
            <button
              type="button"
              onClick={() => setActiveView('caregiver-dash')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'caregiver-dash'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sou Cuidador(a)
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <NotificationCenter />
            <button
              type="button"
              onClick={() => setActiveView('onboarding')}
              className="px-4 py-2 bg-[#96382B] hover:bg-[#7D2E23] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Quero Ser Cuidador</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal de Acordo com a Visão Selecionada */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onExploreDiscovery={(category) => {
              if (category && category !== 'all') {
                setActiveTab(category as any);
              }
              setActiveView('discovery');
            }}
            onExploreVerification={() => setActiveView('discovery')}
            onOpenCaregiverOnboarding={() => setActiveView('onboarding')}
            onOpenCaregiverPortal={() => setActiveView('caregiver-dash')}
            onSelectCaregiver={(cg) => {
              setSelectedCaregiver(cg);
            }}
          />
        )}

        {activeView === 'discovery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header da Busca */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Homologadas & Protegidas por Seguro
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 font-display">
                Cuidado de confiança com custódia e seguro para a sua família
              </h1>
              <p className="text-sm text-zinc-600">
                Babás, cuidadores de idosos e pet sitters verificados judicialmente. O pagamento só é liberado após a realização do plantão.
              </p>
            </div>

            {/* Categorias Rápidas */}
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#96382B] text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Todos os Cuidados
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('babysitter')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'babysitter'
                    ? 'bg-[#96382B] text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Babás & Recreação
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('elderly_care')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'elderly_care'
                    ? 'bg-[#96382B] text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Cuidado Sênior
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pet_sitter')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'pet_sitter'
                    ? 'bg-[#96382B] text-white shadow-xs'
                    : 'bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                Pet Sitting
              </button>
            </div>

            {/* Vitrine de Profissionais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-zinc-900">
                  Profissionais Homologados Próximos de Você ({filteredCaregivers.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCaregivers.map((caregiver) => (
                  <div
                    key={caregiver.id}
                    className="bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3.5">
                        <img
                          src={caregiver.avatar_url}
                          alt={caregiver.full_name}
                          className="w-16 h-16 rounded-2xl object-cover border border-zinc-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-base font-black text-zinc-900 truncate">
                              {caregiver.full_name}
                            </h3>
                            <VerificationBadge size="sm" />
                          </div>
                          <p className="text-xs text-zinc-500 font-medium truncate mt-0.5">
                            {caregiver.headline}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1.5">
                            <span className="flex items-center gap-1 font-bold text-zinc-800">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {caregiver.rating} ({caregiver.reviews_count})
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                              {caregiver.city}, {caregiver.state}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {caregiver.bio}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {caregiver.specialties?.slice(0, 3).map((spec, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-zinc-100 text-zinc-600"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 block font-medium">A partir de</span>
                        <span className="text-base font-black text-zinc-900">
                          R$ {((caregiver.hourly_rate_cents || 1500) / 100).toFixed(2).replace('.', ',')}
                          <span className="text-xs font-normal text-zinc-500"> / hora</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCaregiver(caregiver);
                          }}
                          className="px-3 py-2 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
                        >
                          Ver Perfil
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCaregiver(caregiver);
                            setIsHireModalOpen(true);
                          }}
                          className="px-4 py-2 text-xs font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] rounded-xl transition-colors cursor-pointer shadow-2xs"
                        >
                          Contratar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeView === 'family-dash' && <FamilyDashboard />}
        {activeView === 'caregiver-dash' && <CaregiverDashboard />}
        {activeView === 'onboarding' && (
          <CaregiverOnboarding
            onBack={() => setActiveView('landing')}
            onComplete={() => setActiveView('caregiver-dash')}
          />
        )}
      </main>

      {/* Botão Flutuante de SOS Plantão */}
      <button
        type="button"
        onClick={() => setIsSosModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3 rounded-full font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 shadow-xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer animate-pulse"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
        <span>SOS Plantão</span>
      </button>

      {/* Modal de Contratação (Único, Pacote e Mensal) */}
      {selectedCaregiver && isHireModalOpen && (
        <HireCaregiverModal
          caregiver={selectedCaregiver}
          isOpen={isHireModalOpen}
          onClose={() => setIsHireModalOpen(false)}
        />
      )}

      {/* Modal de Detalhes da Cuidadora */}
      {selectedCaregiver && !isHireModalOpen && (
        <CaregiverDetailsModal
          caregiver={selectedCaregiver}
          isOpen={!!selectedCaregiver}
          onClose={() => setSelectedCaregiver(null)}
          onHireClick={() => setIsHireModalOpen(true)}
        />
      )}

      {/* Modal SOS */}
      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />
    </div>
  );
}
