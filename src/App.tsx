import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Cpu,
  Palette,
  Sparkles,
  Database,
  ExternalLink,
  Users,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Home,
  Image as ImageIcon,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { Logo } from './components/brand/Logo';
import { LogoUploaderModal } from './components/brand/LogoUploaderModal';
import { LandingPage } from './components/landing/LandingPage';
import { CaregiverSearch } from './components/discovery/CaregiverSearch';
import { VerificationStateMachine } from './components/verification/VerificationStateMachine';
import { StrategyDecisions } from './components/architecture/StrategyDecisions';
import { StyleGuide } from './components/brand/StyleGuide';
import { HireAndPaymentFlow } from './components/workflow/HireAndPaymentFlow';
import { CaregiverOnboarding } from './components/onboarding/CaregiverOnboarding';
import { CaregiverPortal } from './components/caregiver/CaregiverPortal';
import { VerificationBadge } from './components/brand/Badge';
import { CaregiverBadge, CaregiverCategory, CaregiverProfile } from './types/database';
import { tuttiZeloRepo, SUPABASE_CONFIG } from './lib/supabase';

export default function App() {
  const [activeView, setActiveView] = useState<'landing' | 'discovery' | 'verification' | 'onboarding' | 'portal' | 'strategy' | 'styleguide'>('landing');
  const [searchCategory, setSearchCategory] = useState<'all' | CaregiverCategory>('all');
  const [selectedCaregiverForModal, setSelectedCaregiverForModal] = useState<any | null>(null);
  const [hiringCaregiver, setHiringCaregiver] = useState<any | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(0);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const caregivers = tuttiZeloRepo.getPublishedCaregivers();
  const verificationCases = tuttiZeloRepo.getVerificationCases();

  const handleStateChangeSuccess = () => {
    setRefreshToggle((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col selection:bg-[#FDF6F4] selection:text-[#96382B]">
      {/* Top Banner: Supabase + Vercel Integration Notice */}
      <div className="bg-zinc-900 text-zinc-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>Schema PostgreSQL / Supabase Fase 1 Carregado</span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400">
            Tenant Ativo: <strong className="text-zinc-200">tuttizelo (Kondora Tech)</strong>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="text-zinc-400">Triggers de Máquina de Estados & LGPD Prontas</span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
            Vercel Deploy Ready
          </span>
        </div>
      </div>

      {/* Main Header with Logo & Navigation */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBDCD7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => {
              setHiringCaregiver(null);
              setActiveView('landing');
            }}
            className="cursor-pointer"
          >
            <Logo size="md" showSubtitle />
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('landing');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'landing' && !hiringCaregiver
                  ? 'bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('discovery');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'discovery' && !hiringCaregiver
                  ? 'bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Busca & Match Curado</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('verification');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'verification'
                  ? 'bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Motor de Verificação</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('onboarding');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'onboarding'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Quero Ser Cuidador(a)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('portal');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'portal'
                  ? 'bg-[#96382B] text-white shadow-xs'
                  : 'text-[#96382B] bg-[#FDF6F4] hover:bg-[#F5D8D0] border border-[#F5D8D0]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Minha Carteira & Plantões</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('strategy');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'strategy'
                  ? 'bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Decisões & Riscos</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('styleguide');
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                activeView === 'styleguide'
                  ? 'bg-[#FDF6F4] text-[#96382B] border border-[#F5D8D0]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Guia de Estilos & A11y</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {hiringCaregiver ? (
          <HireAndPaymentFlow
            caregiver={hiringCaregiver}
            onBack={() => setHiringCaregiver(null)}
          />
        ) : (
          <>
            {activeView === 'landing' && (
              <LandingPage
                onExploreDiscovery={(category) => {
                  if (category) {
                    setSearchCategory(category);
                  }
                  setActiveView('discovery');
                }}
                onExploreVerification={() => setActiveView('verification')}
                onSelectCaregiver={(caregiver) => setSelectedCaregiverForModal(caregiver)}
                onOpenCaregiverOnboarding={() => setActiveView('onboarding')}
                onOpenCaregiverPortal={() => setActiveView('portal')}
              />
            )}

            {activeView === 'discovery' && (
              <CaregiverSearch
                caregivers={caregivers as any}
                initialCategory={searchCategory}
                onSelectCaregiver={(caregiver) => setSelectedCaregiverForModal(caregiver)}
                onInitiateHire={(caregiver) => setHiringCaregiver(caregiver)}
                onOpenOnboarding={() => setActiveView('onboarding')}
                onOpenPortal={() => setActiveView('portal')}
              />
            )}

            {activeView === 'verification' && (
              <VerificationStateMachine
                cases={verificationCases}
                onStateChangeSuccess={handleStateChangeSuccess}
              />
            )}

            {activeView === 'onboarding' && (
              <CaregiverOnboarding
                onSuccess={(newCaregiver) => {
                  tuttiZeloRepo.registerCaregiver(newCaregiver);
                  setRefreshToggle((p) => p + 1);
                  setSelectedCaregiverForModal(newCaregiver);
                  setActiveView('discovery');
                }}
                onCancel={() => setActiveView('landing')}
              />
            )}

            {activeView === 'portal' && <CaregiverPortal />}

            {activeView === 'strategy' && <StrategyDecisions />}

            {activeView === 'styleguide' && <StyleGuide />}
          </>
        )}
      </main>

      {/* Caregiver Detailed Modal */}
      <LogoUploaderModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {selectedCaregiverForModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-caregiver-name"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCaregiverForModal.avatar_url}
                  alt={selectedCaregiverForModal.full_name}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-zinc-100"
                />
                <div>
                  <h3 id="modal-caregiver-name" className="text-xl font-bold text-zinc-900 font-display">
                    {selectedCaregiverForModal.full_name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-xs font-bold text-zinc-900">
                      {selectedCaregiverForModal.category === 'babysitter' && '👶 Babá & Cuidado Infantil'}
                      {selectedCaregiverForModal.category === 'elderly_care' && '🧓 Cuidador de Idosos & Home Care'}
                      {selectedCaregiverForModal.category === 'pet_sitter' && '🐾 Pet Sitter & Dog Walker'}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>
                        {selectedCaregiverForModal.city}, {selectedCaregiverForModal.state}
                      </span>
                      <span>•</span>
                      <span>{selectedCaregiverForModal.years_experience} anos de exp.</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCaregiverForModal(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 rounded-xl hover:bg-zinc-100 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Badges Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700 block">Selos de Verificação & Auditoria</span>
              <div className="flex flex-wrap gap-2">
                {selectedCaregiverForModal.badges.level_1_verified_at && (
                  <VerificationBadge level="level_1_identity" showDetails />
                )}
                {selectedCaregiverForModal.badges.level_2_verified_at && (
                  <VerificationBadge level="level_2_background" showDetails />
                )}
                {selectedCaregiverForModal.badges.level_3_verified_at && (
                  <VerificationBadge level="level_3_plus" showDetails />
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-700 block">Sobre o(a) Profissional</span>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {selectedCaregiverForModal.bio}
              </p>
            </div>

            {/* States Lived & Court Verification Jurisdiction */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
              <span className="font-bold text-zinc-900 block">
                Histórico Judicial Estadual (Tabela <code>states_lived</code>)
              </span>
              <p className="text-zinc-600">
                Estados onde residiu e teve certidões criminais negativas conferidas em fontes oficiais dos Tribunais de Justiça:
              </p>
              <div className="flex gap-2 flex-wrap">
                {(selectedCaregiverForModal.states_lived || [selectedCaregiverForModal.state || 'SP']).map((uf: string) => (
                  <span key={uf} className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold font-mono">
                    TJ{uf} · Nada Consta
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold font-mono">
                  Polícia Federal · SINIC
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-700 block">Especialidades & Habilidades</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedCaregiverForModal.specialties || []).map((s: string) => (
                  <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer: Rate + Hire Button */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-zinc-500 block">Valor por hora</span>
                <span className="text-xl font-extrabold text-zinc-900">
                  {(selectedCaregiverForModal.hourly_rate_cents / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                  <span className="text-xs font-normal text-zinc-500">/h</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCaregiverForModal(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 cursor-pointer min-h-[44px]"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHiringCaregiver(selectedCaregiverForModal);
                    setSelectedCaregiverForModal(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] cursor-pointer shadow-xs min-h-[44px] flex items-center gap-1.5"
                >
                  <span>Iniciar Fluxo de Contratação</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>•</span>
            <span>Cuidado de Babás, Idosos e Pets com Verificação Rigorosa</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Kondora Tech © {new Date().getFullYear()}</span>
            <span>•</span>
            <span>Conforme LGPD (Lei 13.709/2018)</span>
            <span>•</span>
            <span className="font-mono text-zinc-400">PostgreSQL + Supabase</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
