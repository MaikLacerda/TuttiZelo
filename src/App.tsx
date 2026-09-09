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

export function App() {
  const [activeView, setActiveView] = useState<'discovery' | 'family-dash' | 'caregiver-dash' | 'onboarding'>('discovery');
  const [caregivers, setCaregivers] = useState<CaregiverWithDetails[]>([]);
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
          // Mock garantido caso banco esteja vazio
          setCaregivers([
            {
              id: 'cg-01',
              full_name: 'Dra. Camila Ribeiro',
              category: 'elderly_care',
              headline: 'Enfermeira Geriatra • Pós-operatório & Alzheimer',
              bio: 'Especialista em cuidados intensivos e terceira idade. 8 anos de experiência em ambiente hospitalar e domiciliar.',
              birth_date: '1988-04-12',
              city: 'São Paulo',
              state: 'SP',
              hourly_rate_cents: 1600,
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
              hourly_rate_cents: 1500,
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
              hourly_rate_cents: 1400,
              rating: 4.92,
              reviews_count: 19,
              avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
              specialties: ['Cães Idosos', 'Medicação Oral', 'Adestramento Positivo'],
              years_experience: 4,
              badges: { level_1_verified_at: new Date().toISOString(), level_2_verified_at: new Date().toISOString() },
            },
          ]);
        }
      } catch (err) {
        console.error(err);
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
      {/* Barra de Navegação Superior */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBDCD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div
            onClick={() => setActiveView('discovery')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#96382B] flex items-center justify-center text-white font-black shadow-xs">
              TZ
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-zinc-900 font-display block leading-none">
                TuttiZelo
              </span>
              <span className="text-[10px] text-zinc-400 font-medium">Cuidados & Custódia Segura</span>
            </div>
          </div>

          {/* Alternador de Modo de Visão */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveView('discovery')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeView === 'discovery'
                  ? 'bg-white text-zinc-900 shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Explorar
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
                  ? 'bg-white text-[#96382B] shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sou Cuidador(a)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <NotificationCenter />
            {activeView !== 'onboarding' && (
              <button
                type="button"
                onClick={() => setActiveView('onboarding')}
                className="hidden sm:flex px-4 py-2 rounded-xl bg-[#96382B] hover:bg-[#7D2E23] text-white text-xs font-bold transition-all shadow-xs cursor-pointer items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Quero Ser Cuidador</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal Conforme a Visão */}
      <main className="flex-1">
        {activeView === 'onboarding' && (
          <CaregiverOnboarding
            onSuccess={(newCg) => {
              setCaregivers((prev) => [newCg as any, ...prev]);
              setActiveView('caregiver-dash');
            }}
            onCancel={() => setActiveView('discovery')}
          />
        )}

        {activeView === 'caregiver-dash' && (
          <CaregiverDashboard
            onBackToDiscovery={() => setActiveView('discovery')}
            onPreviewPublicProfile={() => {
              if (caregivers[0]) setSelectedCaregiver(caregivers[0]);
            }}
          />
        )}

        {activeView === 'family-dash' && (
          <FamilyDashboard
            onViewDiscovery={() => setActiveView('discovery')}
            onRehire={(cg) => {
              setSelectedCaregiver(cg);
              setIsHireModalOpen(true);
            }}
          />
        )}

        {activeView === 'discovery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Banner com Proposta de Valor */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wide bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Homologadas & Protegidas por Seguro
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 font-display tracking-tight">
                Cuidado de confiança com custódia e seguro para a sua família
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500">
                Babás, cuidadores de idosos e pet sitters verificados judicialmente. O pagamento só é liberado após a realização do plantão.
              </p>
            </div>

            {/* Barra de Busca e Filtro */}
            <SearchAndFilterBar
              activeCategory={activeTab}
              onCategoryChange={(cat) => setActiveTab(cat as any)}
              onSearch={() => {}}
            />

            {/* Grid de Cuidadores */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-zinc-900 font-display">
                  Profissionais Homologados Próximos de Você ({filteredCaregivers.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCaregivers.map((cg) => (
                  <div
                    key={cg.id}
                    onClick={() => setSelectedCaregiver(cg)}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EBDCD7] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={cg.avatar_url}
                          alt={cg.full_name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-base font-black text-zinc-900 group-hover:text-[#96382B] transition-colors">
                              {cg.full_name}
                            </h4>
                            <span className="px-2 py-0.2 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3" /> Nível 2
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 line-clamp-1">{cg.headline}</p>
                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#96382B]" /> {cg.city}, {cg.state}
                            </span>
                            <span className="text-amber-500 font-bold flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500" /> {cg.rating || 4.9}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2">{cg.bio}</p>

                      <div className="flex flex-wrap gap-1.5">
                        {cg.specialties?.slice(0, 2).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-medium block">Tarifa por hora</span>
                        <span className="text-base font-black text-zinc-900">
                          R$ {(cg.hourly_rate_cents / 100).toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCaregiver(cg);
                            setIsHireModalOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#96382B] text-white hover:bg-[#7D2E23] text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Contratar</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setChatModalCaregiver(cg);
                            setIsChatModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                          title="Chat Seguro"
                        >
                          <MessageCircle className="w-4 h-4 text-[#96382B]" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewModalCaregiver(cg);
                            setIsReviewModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                          title="Avaliar"
                        >
                          <Star className="w-4 h-4 text-amber-500" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAuditModalCaregiver(cg);
                            setIsAuditModalOpen(true);
                          }}
                          className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 cursor-pointer"
                          title="Auditar Certidões"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modais Globais */}
      {selectedCaregiver && (
        <CaregiverDetailsModal
          caregiver={selectedCaregiver}
          isOpen={!!selectedCaregiver && !isHireModalOpen}
          onClose={() => setSelectedCaregiver(null)}
          onHire={() => setIsHireModalOpen(true)}
        />
      )}

      {selectedCaregiver && (
        <HireCaregiverModal
          caregiver={selectedCaregiver}
          isOpen={isHireModalOpen}
          onClose={() => setIsHireModalOpen(false)}
        />
      )}

      {auditModalCaregiver && (
        <PublicBadgeAuditModal
          caregiver={auditModalCaregiver}
          isOpen={isAuditModalOpen}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

      {chatModalCaregiver && (
        <ShiftChatAndNotesModal
          caregiver={chatModalCaregiver}
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
        />
      )}

      {reviewModalCaregiver && (
        <ReviewModal
          caregiver={reviewModalCaregiver}
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
        />
      )}

      <EmergencySosModal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
      />

      {/* Botão Flutuante de Emergência SOS */}
      <button
        type="button"
        onClick={() => setIsSosModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-4 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
        <span>SOS Plantão</span>
      </button>
    </div>
  );
}
