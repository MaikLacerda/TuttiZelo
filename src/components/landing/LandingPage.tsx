import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Search,
  Star,
  CreditCard,
  ArrowRight,
  HelpCircle,
  Check,
  ChevronDown,
  Award,
  UserCheck,
  Clock,
  Sparkles,
  Heart,
  Baby,
  Dog,
  Activity,
  MapPin,
  Calendar,
  AlertCircle,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { CaregiverCategory } from '../../types/database';

interface LandingPageProps {
  onExploreDiscovery: (category?: CaregiverCategory | 'all') => void;
  onExploreVerification: () => void;
  onSelectCaregiver?: (caregiver: any) => void;
  onOpenCaregiverOnboarding?: () => void;
  onOpenCaregiverPortal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onExploreDiscovery,
  onExploreVerification,
  onOpenCaregiverOnboarding,
  onOpenCaregiverPortal,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [heroCategory, setHeroCategory] = useState<CaregiverCategory>('babysitter');

  // Configuração interativa dos 3 pilares de cuidado no Hero
  const heroCareOptions: Record<
    CaregiverCategory,
    {
      label: string;
      icon: typeof Baby;
      badgePill: string;
      photoUrl: string;
      fallbackUrl: string;
      photoAlt: string;
      specialtyTitle: string;
      specialtySubtitle: string;
      floatingQuote: string;
      floatingAuthor: string;
      floatingBadge: string;
      actionButtonText: string;
      highlightFeatures: string[];
    }
  > = {
    babysitter: {
      label: 'Babás & Crianças',
      icon: Baby,
      badgePill: 'Cuidado Infantil & Primeiros Passos',
      photoUrl: '/hero-caregiver.jpg',
      fallbackUrl:
        'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Caregiver_reading_to_child_in_a_bright%2C_colorful_playroom_during_a_warm_afternoon.jpg/1280px-Caregiver_reading_to_child_in_a_bright%2C_colorful_playroom_during_a_warm_afternoon.jpg',
      photoAlt:
        'Cuidadora acolhedora e paciente lendo livrinho para criança em ambiente alegre e acolhedor',
      specialtyTitle: 'Babá & Desenvolvimento Infantil',
      specialtySubtitle: 'Apoio escolar, sono seguro e carinho',
      floatingQuote: '"O anjo da nossa casa"',
      floatingAuthor: 'Mariana S. · Mãe do Theo',
      floatingBadge: 'Primeiros Socorros Pediátricos',
      actionButtonText: 'Encontrar Babá Verificada',
      highlightFeatures: [
        'Primeiros socorros infantis',
        'Rotina escolar e sem telas',
        'Referências de mães auditadas',
      ],
    },
    elderly_care: {
      label: 'Cuidadores de Idosos',
      icon: Heart,
      badgePill: 'Cuidado Geriátrico & Terceira Idade',
      photoUrl: '/hero-elderly.jpg',
      fallbackUrl:
        'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80',
      photoAlt:
        'Cuidadora dedicada segurando a mão de uma senhora idosa com carinho, paciência e respeito',
      specialtyTitle: 'Cuidado Sênior & Home Care',
      specialtySubtitle: 'Rotina de saúde, medicação e companhia',
      floatingQuote: '"Minha mãe tem paz e carinho"',
      floatingAuthor: 'Dr. André P. · Filho da D. Nair (84a)',
      floatingBadge: 'Téc. Enfermagem & Geriatria',
      actionButtonText: 'Encontrar Cuidador de Idosos',
      highlightFeatures: [
        'Administração de medicação',
        'Mobilidade e prevenção de quedas',
        'Aferição diária de sinais vitais',
      ],
    },
    pet_sitter: {
      label: 'Pet Sitters & Pets',
      icon: Dog,
      badgePill: 'Cuidado Pet Domiciliar & Dog Walking',
      photoUrl: '/hero-pet.jpg',
      fallbackUrl:
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
      photoAlt:
        'Pet sitter afetuoso acariciando e brincando com cachorro alegre e bem cuidado no lar',
      specialtyTitle: 'Pet Sitting & Hospedagem',
      specialtySubtitle: 'Passeios, enriquecimento e carinho',
      floatingQuote: '"Viajo em paz sabendo que estão felizes"',
      floatingAuthor: 'Fernanda V. · Tutora de 2 cães',
      floatingBadge: 'Comportamento & Socorros Vet',
      actionButtonText: 'Encontrar Pet Sitter Verificado',
      highlightFeatures: [
        'No conforto do próprio lar',
        'Passeios educativos seguros',
        'Fotos e vídeos diários no chat',
      ],
    },
  };

  const currentCare = heroCareOptions[heroCategory];

  const faqs = [
    {
      q: 'Quais modalidades de profissionais posso encontrar na TuttiZelo?',
      a: 'A TuttiZelo atende as 3 principais necessidades da família brasileira com o mesmo nível de exigência e segurança: 1) Babás e berçaristas para crianças e bebês; 2) Cuidadores de idosos e acompanhantes geriátricos (com experiência em home care e mobilidade); 3) Pet sitters e dog walkers para cães e gatos em domicílio.',
    },
    {
      q: 'Como funciona a checagem de antecedentes em múltiplos estados (states_lived)?',
      a: 'Diferente de consultas simplistas que olham apenas o estado atual, a TuttiZelo mapeia todas as Unidades da Federação onde o profissional residiu nos últimos 5 anos. Consultamos os Tribunais de Justiça estaduais (1º e 2º grau), Tribunal Regional Federal (TRF), Polícia Federal (SINIC) e o Banco Nacional de Mandados de Prisão (BNMP/CNJ).',
    },
    {
      q: 'O que é a Prova de Vida com Liveness (Nível 1)?',
      a: 'Ao enviar o documento com foto (RG/CNH), o candidato realiza uma selfie biométrica em tempo real com teste de vivacidade (liveness detection 3D). Isso impede o uso de fotos estáticas, documentos de terceiros ou fraudes de identidade.',
    },
    {
      q: 'Qual é a taxa de intermediação para os profissionais (cuidadores, babás e pet sitters)?',
      a: 'A TuttiZelo adota uma taxa de serviço justa de 10% a 15% sobre o valor dos plantões concluídos (muito abaixo de agências tradicionais que retêm de 25% a 40%). Essa taxa financia o seguro de acidentes do plantão, custódia protegida pelo Banco Central para evitar calotes, tecnologia contínua e processamento imediato de PIX após o check-out.',
    },
    {
      q: 'Como o check-in e check-out por GPS protegem o contratante e o cuidador?',
      a: 'Quando o profissional chega ao local combinado, ele realiza o check-in no aplicativo com geolocalização exata e carimbo de data/hora oficial. No término do plantão, o check-out gera automaticamente a contabilidade exata das horas cumpridas, libera a custódia segura e emite o recibo legal.',
    },
    {
      q: 'Como os dados são protegidos perante a LGPD (Lei 13.709/2018)?',
      a: 'Cumprimos rigorosamente as diretrizes da ANPD. Todos os dados biométricos e antecedentes contam com consentimento explícito e específico para a finalidade de proteção familiar, com criptografia ponta a ponta e auditorias automáticas com expiração programada de 180 dias.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 max-w-7xl mx-auto">
      {/* 1. HERO SECTION SPLIT MULTI-CUIDADO: BABÁS, IDOSOS & PETS */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FDF8F6] via-white to-[#FAF6F2] border border-[#EBDCD7] p-6 sm:p-10 lg:p-12 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Coluna Esquerda: Proposta de Valor Tripla & Seletor de Cuidado */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            {/* Selo Superior */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#F5D8D0] text-[#96382B] text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Babás · Cuidadores de Idosos · Pet Sitters</span>
            </div>

            {/* Headline com os 3 Pilares */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-[#2B1815] tracking-tight font-display leading-[1.15]">
              Cuidado e zelo de verdade para quem você{' '}
              <span className="text-[#96382B]">mais ama no mundo.</span>
            </h1>

            {/* Subtítulo Claro e Inclusivo */}
            <p className="text-base sm:text-lg text-[#5C4541] leading-relaxed font-normal max-w-xl">
              Conectamos você à rede mais segura do Brasil com tripla checagem obrigatória: 
              <strong> babás carinhosas para seus filhos</strong>, 
              <strong> cuidadores dedicados para idosos</strong> e 
              <strong> pet sitters certificados</strong> para cães e gatos.
            </p>

            {/* Seletor Rápido das 3 Modalidades no Hero */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Escolha o que a sua família precisa hoje:
              </span>
              <div
                id="hero-care-switcher"
                className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white border border-[#EBDCD7] shadow-2xs max-w-lg"
              >
                {(
                  [
                    { key: 'babysitter', label: 'Babás', icon: Baby },
                    { key: 'elderly_care', label: 'Idosos', icon: Heart },
                    { key: 'pet_sitter', label: 'Pets', icon: Dog },
                  ] as const
                ).map(({ key, label, icon: Icon }) => {
                  const isActive = heroCategory === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setHeroCategory(key)}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px] ${
                        isActive
                          ? 'bg-[#96382B] text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-[#FDF6F4]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ações Principais com Redirecionamento Direto */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 flex-wrap">
              <button
                id="hero-cta-button"
                type="button"
                onClick={() => onExploreDiscovery(heroCategory)}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] active:bg-[#64241B] transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Search className="w-4 h-4" />
                <span>{currentCare.actionButtonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onExploreDiscovery('all')}
                className="px-6 py-3.5 rounded-xl font-bold text-sm text-[#96382B] bg-white hover:bg-[#FDF6F4] border border-[#EBDCD7] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
              >
                <Sparkles className="w-4 h-4 text-[#96382B]" />
                <span>Ver Todos</span>
              </button>

              {onOpenCaregiverOnboarding && (
                <button
                  type="button"
                  onClick={onOpenCaregiverOnboarding}
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <UserPlus className="w-4 h-4 text-emerald-700" />
                  <span>Quero Ser Cuidador(a)</span>
                </button>
              )}

              {onOpenCaregiverPortal && (
                <button
                  type="button"
                  onClick={onOpenCaregiverPortal}
                  className="px-5 py-3.5 rounded-xl font-bold text-sm text-[#96382B] bg-[#FDF6F4] hover:bg-[#F5D8D0] border border-[#F5D8D0] transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <Wallet className="w-4 h-4 text-[#96382B]" />
                  <span>Painel do Cuidador & Carteira</span>
                </button>
              )}
            </div>

            {/* Prova Social & Micro-Garantias */}
            <div className="pt-5 border-t border-[#EBDCD7] flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-[#5C4541]">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                    alt="Mãe atendida"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80"
                    alt="Filho de idosa atendido"
                    referrerPolicy="no-referrer"
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                    alt="Tutora de pet atendida"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="font-bold text-zinc-900 ml-1">4.9/5</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Mais de 1.200 famílias, idosos e pets atendidos
                  </span>
                </div>
              </div>

              <div className="hidden sm:block w-px h-6 bg-[#EBDCD7]" />

              <div className="flex items-center gap-3 text-[11px] text-zinc-600 font-medium">
                <span className="flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Taxa justa de 10% a 15% (com seguro de plantão)
                </span>
                <span className="flex items-center gap-1 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Auditoria criminal em 27 UFs
                </span>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Imagem Dinâmica do Cuidado com Badges Flutuantes */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Foto Principal com transição de acordo com o Cuidado Selecionado */}
              <div
                id="hero-caregiver-photo-container"
                className="relative rounded-3xl overflow-hidden border-2 border-white shadow-xl bg-[#FAF6F2] aspect-[4/4.2] min-h-[360px]"
              >
                <img
                  id="hero-caregiver-photo"
                  key={currentCare.photoUrl}
                  src={currentCare.photoUrl}
                  alt={currentCare.photoAlt}
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== currentCare.fallbackUrl) {
                      target.src = currentCare.fallbackUrl;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

                {/* Tag de Segurança na Foto */}
                <div
                  id="hero-photo-verified-badge"
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3.5 rounded-2xl shadow-sm border border-white/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 leading-tight">
                        {currentCare.specialtyTitle}
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        {currentCare.specialtySubtitle}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] border border-emerald-200 shrink-0">
                    🟢 Ativa
                  </span>
                </div>
              </div>

              {/* Badge Flutuante Superior (Depoimento Contextual) */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white p-3 rounded-2xl shadow-md border border-[#F5D8D0] max-w-[220px] hidden sm:flex items-center gap-2.5 animate-fade-in">
                <div className="w-7 h-7 rounded-full bg-[#FDF6F4] text-[#96382B] flex items-center justify-center shrink-0">
                  <Heart className="w-3.5 h-3.5 fill-[#96382B]" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-900 leading-tight">
                    {currentCare.floatingQuote}
                  </p>
                  <span className="text-[9px] text-zinc-500">
                    {currentCare.floatingAuthor}
                  </span>
                </div>
              </div>

              {/* Badge Flutuante Inferior (Especialidade Ativa) */}
              <div className="absolute -bottom-3 -left-2 sm:-left-4 bg-white p-2.5 px-3.5 rounded-2xl shadow-md border border-emerald-100 hidden sm:flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] font-bold text-zinc-800">
                  {currentCare.floatingBadge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OS 3 PILARES DO CUIDADO TUTTIZELO (BABÁS, IDOSOS E PETS) */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FDF6F4] text-[#96382B] text-xs font-bold border border-[#F5D8D0]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>As 3 Modalidades de Cuidado</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2B1815] font-display">
            Três tipos de zelo. O mesmo rigor inegociável de segurança.
          </h2>
          <p className="text-sm sm:text-base text-[#5C4541] leading-relaxed">
            Seja para acolher seu filho, amparar seus pais na terceira idade ou passear com seu animal de estimação, cada profissional passa pelas mesmas três barreiras forenses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Babás & Cuidado Infantil */}
          <div className="p-7 rounded-3xl bg-white border border-[#EBDCD7] shadow-2xs space-y-5 hover:border-[#F5D8D0] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-100">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Cuidado Infantil
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">
                  Babás & Berçaristas
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Profissionais carinhosas para bebês e crianças de todas as idades. Apoio em rotina escolar, recreação criativa, alimentação regrada e sono tranquilo.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Primeiros socorros pediátricos validados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Referências com mães anteriores por telefone</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Varredura criminal completa em 27 UFs</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('babysitter')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#96382B] bg-[#FDF6F4] hover:bg-[#F5D8D0] border border-[#F5D8D0] transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Ver Babás Verificadas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Cuidadores de Idosos & Home Care */}
          <div className="p-7 rounded-3xl bg-white border-2 border-[#F5D8D0] bg-gradient-to-b from-[#FDF6F4]/40 to-white shadow-xs space-y-5 flex flex-col justify-between relative">
            <div className="absolute -top-3 right-6 bg-[#96382B] text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide">
              Geriatria & Zelo
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center border border-rose-100">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#96382B]">
                  Terceira Idade & Sênior
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">
                  Cuidadores de Idosos
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Técnicos de enfermagem e cuidadores especializados no acompanhamento humanizado, apoio à mobilidade, prevenção de quedas e administração de medicações.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Experiência em Alzheimer, Parkinson & AVC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Aferição diária de pressão e glicemia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Companhia acolhedora e estímulo cognitivo</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('elderly_care')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Ver Cuidadores de Idosos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Pet Sitters & Dog Walkers */}
          <div className="p-7 rounded-3xl bg-white border border-[#EBDCD7] shadow-2xs space-y-5 hover:border-[#F5D8D0] transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
                <Dog className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Cuidado Animal & Domicílio
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">
                  Pet Sitters & Dog Walkers
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Cuidador dedicado para seus cães e gatos sem tirá-los do ambiente familiar. Passeios educativos, alimentação com medicação oral e enriquecimento ambiental.
              </p>

              <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Primeiros socorros veterinários e manejo</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Relatórios com fotos e vídeos em tempo real</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Check-in e check-out por GPS do passeio</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('pet_sitter')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
            >
              <span>Ver Pet Sitters Verificados</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. A MAIS RIGOROSA TRIPLA CHECAGEM DO BRASIL */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Auditoria Forense & Biometria</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2B1815] font-display">
            Apenas 1 em cada 5 candidatos é aprovado
          </h2>
          <p className="text-sm sm:text-base text-[#5C4541] leading-relaxed">
            Eliminamos o risco de grupos informais e anúncios anônimos. Seja babá, cuidador de idosos ou pet sitter, todo profissional cumpre 3 etapas de auditoria antes de publicar perfil.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pilar 1: Identidade */}
          <div className="p-7 rounded-3xl bg-white border border-[#EBDCD7] shadow-2xs space-y-4 hover:border-[#F5D8D0] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-100">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                Nível 1 · Identidade
              </span>
              <h3 className="text-lg font-bold text-zinc-900 mt-1">
                Biometria 3D & Receita Federal
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Eliminamos o risco de perfis falsos. O sistema realiza OCR inteligente de documentos (RG/CNH), prova de vida com liveness 3D anti-spoofing e validação na Receita Federal.
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero risco de documentos de terceiros</span>
            </div>
          </div>

          {/* Pilar 2: Antecedentes Multi-Estado */}
          <div className="p-7 rounded-3xl bg-white border-2 border-[#F5D8D0] bg-gradient-to-b from-[#FDF6F4]/50 to-white shadow-xs space-y-4 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Nível 2 · O Grande Diferencial
              </span>
              <h3 className="text-lg font-bold text-zinc-900 mt-1">
                Varredura em Todas as UFs
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Se o profissional residiu em outros estados, checamos os Tribunais de Justiça de cada um deles, a Polícia Federal (SINIC) e o Banco Nacional de Mandados de Prisão (BNMP).
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Multi-Jurisdição em 27 estados</span>
            </div>
          </div>

          {/* Pilar 3: Curadoria Humana */}
          <div className="p-7 rounded-3xl bg-white border border-[#EBDCD7] shadow-2xs space-y-4 hover:border-[#F5D8D0] transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                Nível 3 · Curadoria Humana
              </span>
              <h3 className="text-lg font-bold text-zinc-900 mt-1">
                Referências Reais por Telefone
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Nossa equipe audita ligações telefônicas com famílias anteriores ou clínicas, valida certificados técnicos (primeiros socorros, geriatria ou adestramento) e avalia pontualidade.
            </p>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Recomendações atestadas de verdade</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA EM 3 PASSOS SIMPLES */}
      <section className="space-y-8 bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#EBDCD7]">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#96382B] uppercase tracking-wider">
            Simplicidade & Segurança
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1815] font-display">
            Como contratar com zelo absoluto
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white p-6 rounded-2xl border border-[#EBDCD7] space-y-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FDF6F4] text-[#96382B] font-extrabold text-xs flex items-center justify-center border border-[#F5D8D0]">
              1
            </div>
            <h4 className="font-bold text-base text-zinc-900">Escolha a Categoria</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Filtre por Babá, Cuidador de Idosos ou Pet Sitter, defina seu bairro, faixa de valor e veja as profissionais com selos ativos.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EBDCD7] space-y-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FDF6F4] text-[#96382B] font-extrabold text-xs flex items-center justify-center border border-[#F5D8D0]">
              2
            </div>
            <h4 className="font-bold text-base text-zinc-900">Converse & Entreviste</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tire dúvidas pelo chat protegido, agende entrevista e consulte o dossiê com certidões criminais negativas liberadas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EBDCD7] space-y-3 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-[#FDF6F4] text-[#96382B] font-extrabold text-xs flex items-center justify-center border border-[#F5D8D0]">
              3
            </div>
            <h4 className="font-bold text-base text-zinc-900">Plantão Protegido</h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Pagamento em custódia segura, check-in e check-out via GPS oficial e recibo fiscal gerado automaticamente.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PLANOS PARA O CONTRATANTE (FAMÍLIA) */}
      <section id="planos-contratante" className="space-y-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FDF6F4] text-[#96382B] text-xs font-bold border border-[#F5D8D0]">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Planos para Contratantes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2B1815] font-display">
            Transparência para a família. Dignidade para quem cuida.
          </h2>
          <p className="text-sm sm:text-base text-[#5C4541] leading-relaxed">
            Na TuttiZelo, babás, cuidadores de idosos e pet sitters <strong>não pagam comissões</strong>: o valor total das diárias vai 100% para eles. A família escolhe o plano que melhor atende à sua rotina para custear a infraestrutura de auditoria e segurança.
          </p>
        </div>

        {/* Banner 2 Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
            <div className="inline-flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Para o Profissional (Babás, Idosos ou Pets)</span>
            </div>
            <h4 className="text-sm font-bold text-emerald-950">Taxa Justa: 10% a 15% por Plantão</h4>
            <p className="text-xs text-emerald-800">
              Cadastro 100% grátis. A taxa só é cobrada quando você realiza o plantão e cobre seguro de acidentes, proteção contra calotes e repasse automático via PIX.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#FDF6F4] border border-[#F5D8D0] space-y-1.5">
            <div className="inline-flex items-center gap-2 text-[#96382B] font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#96382B] shrink-0" />
              <span>Para o Contratante (Família ou Tutor)</span>
            </div>
            <h4 className="text-sm font-bold text-[#2B1815]">Proteção, Dossiês & Certeza</h4>
            <p className="text-xs text-[#5C4541]">
              A família assina o plano ideal ou usa o passe avulso para acessar dossiês criminais, chat ilimitado e custódia segura.
            </p>
          </div>
        </div>

        {/* 3 Cartões de Planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plano Mensal */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500">
                  Flexibilidade
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">Plano Mensal</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Ideal para famílias com rotina mensal contínua
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900 font-mono">
                  R$ 49,90
                </span>
                <span className="text-xs text-zinc-500">/ mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Chat e entrevistas ilimitadas</strong> (Babás, Idosos e Pets)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dossiês criminais completos em 27 UFs</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Taxa R$ 0</strong> por contratação de plantão
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Registro de horas por GPS e recibo fiscal</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('all')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#96382B] bg-[#FDF6F4] hover:bg-[#F5D8D0] border border-[#F5D8D0] transition-colors cursor-pointer min-h-[44px]"
            >
              Assinar Plano Mensal
            </button>
          </div>

          {/* Plano Trimestral */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-7 border-2 border-[#96382B] flex flex-col justify-between space-y-6 shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#96382B] text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide shadow-xs whitespace-nowrap">
              Mais Escolhido • Economize 33%
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#96382B]">
                  Mais Completo
                </span>
                <h3 className="text-xl font-bold text-[#2B1815] mt-1">Plano Trimestral</h3>
                <p className="text-xs text-[#5C4541] mt-1">
                  Segurança total para a rotina de filhos, idosos ou pets
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#2B1815] font-mono">
                    R$ 99,90
                  </span>
                  <span className="text-xs text-[#5C4541]">/ trimestre</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                  Apenas R$ 33,30 por mês
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-700 pt-2 border-t border-[#EBDCD7]">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Tudo do Plano Mensal incluído</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dossiê Nível 3</strong> (referências auditadas por telefone)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Prioridade nos matches e urgências</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    Selo <strong>"Família Verificada"</strong> no perfil
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Suporte Concierge prioritário</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('all')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer shadow-sm min-h-[44px]"
            >
              Garantir Plano Trimestral
            </button>
          </div>

          {/* Passe Avulso */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200 flex flex-col justify-between space-y-6 shadow-2xs hover:shadow-xs transition-shadow">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-500">
                  Sem Assinatura
                </span>
                <h3 className="text-xl font-bold text-zinc-900 mt-1">Passe Avulso</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Para plantões eventuais, viagens ou emergências
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-zinc-900 font-mono">
                  R$ 19,90
                </span>
                <span className="text-xs text-zinc-500">/ contratação</span>
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pague somente quando contratar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Libera chat e entrevista com o profissional</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dossiê da profissional selecionada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Custódia segura e garantia de plantão</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onExploreDiscovery('all')}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer min-h-[44px]"
            >
              Contratar com Passe Avulso
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-500 pt-1">
          Quer conhecer primeiro? O cadastro e a busca no catálogo são 100% gratuitos para todas as famílias.
        </p>
      </section>

      {/* 6. DEPOIMENTOS DAS 3 MODALIDADES (BABÁ, IDOSOS E PETS) */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1815] font-display">
            A tranquilidade de quem já confiou
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4541]">
            Histórias reais de mães, filhos de idosos e tutores de pets que transformaram sua rotina com a TuttiZelo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Depoimento 1: Babá */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  Cuidado Infantil
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                "Ver o dossiê com antecedentes negativos em SP e MG me deu a paz que nenhuma indicação de vizinho conseguiria ao voltar da licença-maternidade."
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FDF6F4] text-[#96382B] font-bold flex items-center justify-center text-xs border border-[#F5D8D0]">
                CL
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">Camila Lourenço</h5>
                <span className="text-[11px] text-zinc-500">Mãe do Theo · São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Depoimento 2: Idosos */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  Cuidado Sênior
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                "Minha mãe de 84 anos precisava de alguém pontual para remédios e mobilidade. A técnica de enfermagem Maria de Fátima é um verdadeiro anjo da família."
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-800 font-bold flex items-center justify-center text-xs border border-rose-200">
                AP
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">Dr. André Prado</h5>
                <span className="text-[11px] text-zinc-500">Filho da D. Nair · Campinas, SP</span>
              </div>
            </div>
          </div>

          {/* Depoimento 3: Pet Sitter */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200/90 shadow-2xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Cuidado Pet
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed italic">
                "O Lucas cuidou do Bento e da Luna enquanto viajamos. Os relatórios com fotos e a rota de GPS dos passeios nos deixaram 100% seguros sem estresse para os pets."
              </p>
            </div>
            <div className="pt-2 border-t border-zinc-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-xs border border-emerald-200">
                FV
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">Fernanda Vasconcellos</h5>
                <span className="text-[11px] text-zinc-500">Tutora do Bento & Luna · Curitiba, PR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PERGUNTAS FREQUENTES (FAQ) */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-bold border border-zinc-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dúvidas Frequentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B1815] font-display">
            Tudo o que você precisa saber
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 hover:text-[#96382B] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#96382B]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#96382B] to-[#7D2E23] text-white p-8 sm:p-12 lg:p-14 text-center space-y-6 shadow-md">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/20 text-[#FFE4DE] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Segurança & Zelo Completo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
            Pronto para dar a quem você ama a segurança que ela merece?
          </h2>
          <p className="text-xs sm:text-sm text-[#FFE4DE]/90 max-w-xl mx-auto leading-relaxed">
            Seja para seus filhos, seus pais ou seus pets: cadastre-se gratuitamente e converse com os profissionais mais bem avaliados da sua região.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              type="button"
              onClick={() => onExploreDiscovery('all')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-[#96382B] bg-white hover:bg-[#FDF6F4] active:bg-zinc-100 transition-all shadow-sm cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Ver Cuidadores Verificados</span>
            </button>

            <button
              type="button"
              onClick={onExploreVerification}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-white/10 hover:bg-white/20 border border-white/30 transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Ver Auditoria do Sistema</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
