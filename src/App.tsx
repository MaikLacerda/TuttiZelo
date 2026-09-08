import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Cpu,
  Palette,
  CheckCircle2,
  X,
  MapPin,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Home,
  UserPlus,
  Wallet,
  LogIn,
  UserCheck,
  User,
  LogOut,
  Menu,
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
import { AuthModal, AuthMode, UserType } from './components/auth/AuthModal';
import { CaregiverBadge, CaregiverCategory, CaregiverProfile } from './types/database';
import { tuttiZeloRepo } from './lib/supabase';

export default function App() {
  const [activeView, setActiveView] = useState<
    'landing' | 'discovery' | 'verification' | 'onboarding' | 'portal' | 'strategy' | 'styleguide'
  >('landing');
  const [searchCategory, setSearchCategory] = useState<'all' | CaregiverCategory>('all');
  const [selectedCaregiverForModal, setSelectedCaregiverForModal] = useState<any | null>(null);
  const [hiringCaregiver, setHiringCaregiver] = useState<any | null>(null);
  const [refreshToggle, setRefreshToggle] = useState(0);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Estados de Autenticação & Cadastro
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('register');
  const [authInitialType, setAuthInitialType] = useState<UserType>('family');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; userType: UserType } | null>(null);

  // Menu móvel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const caregivers = tuttiZeloRepo.getPublishedCaregivers();
  const verificationCases = tuttiZeloRepo.getVerificationCases();

  const handleStateChangeSuccess = () => {
    setRefreshToggle((prev) => prev + 1);
  };

  const handleOpenRegister = (type: UserType = 'family') => {
    setAuthMode('register');
    setAuthInitialType(type);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col selection:bg-[#FDF6F4] selection:text-[#96382B]">
      {/* Header Limpo & Comercial */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EBDCD7] shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
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

          {/* Navegação Limpa para Famílias e Cuidadores (Desktop) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              id="nav-home-btn"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('landing');
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeView === 'landing' && !hiringCaregiver
                  ? 'text-[#96382B] bg-[#FDF6F4]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Início
            </button>

            <button
              type="button"
              id="nav-discovery-btn"
              onClick={() => {
                setHiringCaregiver(null);
                setSearchCategory('all');
                setActiveView('discovery');
              }}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeView === 'discovery' && !hiringCaregiver
                  ? 'text-[#96382B] bg-[#FDF6F4]'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              Buscar Cuidadores
            </button>

            <button
              type="button"
              id="nav-be-caregiver-btn"
              onClick={() => {
                setHiringCaregiver(null);
                setActiveView('onboarding');
              }}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>Seja Cuidador(a)</span>
            </button>
          </nav>

          {/* Área de Autenticação / Perfil */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-1.5 pr-3 rounded-2xl border border-[#EBDCD7]">
                <div className="w-8 h-8 rounded-xl bg-[#96382B] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs font-bold text-zinc-900 block truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-zinc-500">
                    {currentUser.userType === 'family' ? 'Família' : 'Cuidador(a)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentUser(null)}
                  className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Sair da conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  id="nav-login-btn"
                  onClick={handleOpenLogin}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-700 hover:text-[#96382B] hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>

                <button
                  type="button"
                  id="nav-register-btn"
                  onClick={() => handleOpenRegister('family')}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] shadow-xs transition-all cursor-pointer"
                >
                  Cadastre-se Grátis
                </button>
              </>
            )}
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#EBDCD7] bg-white p-4 space-y-2">
            <button
              type="button"
              onClick={() => {
                setActiveView('landing');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-zinc-800 hover:bg-zinc-100"
            >
              Início
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('discovery');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-zinc-800 hover:bg-zinc-100"
            >
              Buscar Cuidadores
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveView('onboarding');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50"
            >
              Quero Ser Cuidador(a)
            </button>

            <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleOpenLogin}
                className="w-full py-2.5 rounded-xl text-sm font-bold border border-zinc-300 text-zinc-800"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => handleOpenRegister('family')}
                className="w-full py-2.5 rounded-xl text-sm font-bold bg-[#96382B] text-white"
              >
                Cadastre-se Grátis
              </button>
            </div>
          </div>
        )}
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

      {/* Modal de Autenticação & Cadastro */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        initialUserType={authInitialType}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
        onGoToOnboarding={() => {
          setActiveView('onboarding');
        }}
      />

      {/* Modal do Uploader de Logo */}
      <LogoUploaderModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />

      {/* Modal Detalhado do Cuidador */}
      {selectedCaregiverForModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-caregiver-name"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#EBDCD7] max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCaregiverForModal.photo_url}
                  alt={selectedCaregiverForModal.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 id="modal-caregiver-name" className="text-xl font-bold text-zinc-900">
                      {selectedCaregiverForModal.full_name}
                    </h3>
                    <VerificationBadge level={selectedCaregiverForModal.verification_level} />
                  </div>
                  <p className="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {selectedCaregiverForModal.neighborhood}, {selectedCaregiverForModal.city}
                    </span>
                    <span>•</span>
                    <span>{selectedCaregiverForModal.experience_years} anos de experiência</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaregiverForModal(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 rounded-full hover:bg-zinc-100 cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Biografia Profissional
                </h4>
                <p className="text-sm text-zinc-700 leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBDCD7]">
                  {selectedCaregiverForModal.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Especialidades & Habilidades
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCaregiverForModal.specialties.map((spec: string) => (
                    <span
                      key={spec}
                      className="px-3 py-1 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Selos de Verificação TuttiZelo
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Antecedentes Criminais Aprovados</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Referências Verificadas por Telefone</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Entrevista Técnica Realizada</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Identidade e Selfie Biométrico</span>
                  </div>
                </div>
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
                  <span>Contratar com Segurança</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Limpo com Links Técnicos Discretos */}
      <footer className="bg-white border-t border-zinc-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-3">
              <Logo size="sm" showSubtitle={false} />
              <span>•</span>
              <span>Cuidado profissional verificado de Babás, Idosos e Pets</span>
            </div>
            <div className="flex items-center gap-4">
              <span>TuttiZelo © {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Conforme LGPD (Lei 13.709/2018)</span>
            </div>
          </div>

          {/* Links de Desenvolvimento e Gestão (Discretos no Rodapé) */}
          <div className="pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-zinc-500">Acesso Operacional:</span>
              <button
                type="button"
                onClick={() => setActiveView('verification')}
                className="hover:text-[#96382B] underline cursor-pointer"
              >
                Painel de Verificação
              </button>
              <button
                type="button"
                onClick={() => setActiveView('portal')}
                className="hover:text-[#96382B] underline cursor-pointer"
              >
                Área do Cuidador (Portal)
              </button>
              <button
                type="button"
                onClick={() => setActiveView('strategy')}
                className="hover:text-[#96382B] underline cursor-pointer"
              >
                Arquitetura & Riscos
              </button>
              <button
                type="button"
                onClick={() => setActiveView('styleguide')}
                className="hover:text-[#96382B] underline cursor-pointer"
              >
                Guia Visual
              </button>
            </div>
            <div className="text-zinc-400">
              Supabase PostgreSQL • Vercel Ready
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
