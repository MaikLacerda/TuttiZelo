import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Baby,
  Heart,
  Dog,
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  Info,
  DollarSign,
  FileText,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';
import { CaregiverCategory, CaregiverWithDetails } from '../../types/database';

interface CaregiverOnboardingProps {
  onSuccess: (profile: Partial<CaregiverWithDetails>) => void;
  onCancel: () => void;
}

export const CaregiverOnboarding: React.FC<CaregiverOnboardingProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState<CaregiverCategory>('babysitter');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [yearsExperience, setYearsExperience] = useState<number>(3);
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  );
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [statesLived, setStatesLived] = useState<string[]>(['SP']);
  const [rateError, setRateError] = useState<string>('');

  // LGPD consent states
  const [consentBackgroundCheck, setConsentBackgroundCheck] = useState(true);
  const [consentBiometrics, setConsentBiometrics] = useState(true);
  const [consentTerms, setConsentTerms] = useState(true);

  // Available specialties per category
  const specialtiesByCategory: Record<CaregiverCategory, string[]> = {
    babysitter: [
      'Recém-nascidos',
      'Primeiros Socorros Infantil',
      'Introdução Alimentar',
      'Autismo (TEA)',
      'Acompanhamento Escolar',
      'Inglês Fluente',
      'Rotina Montessoriana',
      'Gêmeos e Múltiplos',
    ],
    elderly_care: [
      'Alzheimer / Demência',
      'Administração de Medicação',
      'Mobilidade Reduzida / Cadeirantes',
      'Pós-operatório',
      'Parkinson',
      'Sinais Vitais',
      'Acompanhamento a Consultas',
      'Nutrição Enteral',
    ],
    pet_sitter: [
      'Cães Grande Porte',
      'Gatos Idosos',
      'Medicação Oral',
      'Adestramento Positivo',
      'Passeio Educativo',
      'Comportamento Felino',
      'Filhotes',
      'Enriquecimento Ambiental',
    ],
  };

  const toggleSpecialty = (spec: string) => {
    if (selectedSpecialties.includes(spec)) {
      setSelectedSpecialties(selectedSpecialties.filter((s) => s !== spec));
    } else {
      setSelectedSpecialties([...selectedSpecialties, spec]);
    }
  };

  const toggleStateLived = (uf: string) => {
    if (statesLived.includes(uf)) {
      if (statesLived.length > 1) {
        setStatesLived(statesLived.filter((s) => s !== uf));
      }
    } else {
      setStatesLived([...statesLived, uf]);
    }
  };

  const brazilianStates = ['SP', 'RJ', 'MG', 'PR', 'RS', 'SC', 'BA', 'PE', 'DF'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Partial<CaregiverWithDetails> = {
      full_name: fullName.trim() || 'Profissional TuttiZelo',
      category,
      headline:
        headline.trim() ||
        (category === 'babysitter'
          ? 'Babá qualificada com foco em acolhimento e desenvolvimento'
          : category === 'elderly_care'
          ? 'Cuidador(a) dedicado(a) com foco em geriatria e bem-estar'
          : 'Pet Sitter especializado(a) em bem-estar e cuidados domiciliares'),
      bio:
        bio.trim() ||
        'Profissional com sólida experiência em acolhimento humanizado, responsabilidade e atenção integral às rotinas acordadas com a família contratante.',
      city,
      state,
      years_experience: yearsExperience,
      hourly_rate_cents: hourlyRate * 100,
      avatar_url: avatarUrl,
      specialties: selectedSpecialties.length > 0 ? selectedSpecialties : specialtiesByCategory[category].slice(0, 3),
      states_lived: statesLived,
      age_groups: category === 'babysitter' ? ['1_3', '4_6'] : [],
    };

    onSuccess(newProfile);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 cursor-pointer min-h-[44px] px-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Início</span>
        </button>

        <div className="text-xs text-zinc-500 font-medium">
          Etapa <span className="font-bold text-zinc-900">{step}</span> de 4
        </div>
      </div>

      {/* Stepper Progress */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto">
          {[
            { id: 1, title: 'Pilar & Categoria' },
            { id: 2, title: 'Perfil Profissional' },
            { id: 3, title: 'Antecedentes & LGPD' },
            { id: 4, title: 'Revisão & Selo' },
          ].map((item, idx) => (
            <div key={item.id} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > item.id
                    ? 'bg-emerald-600 text-white'
                    : step === item.id
                    ? 'bg-[#96382B] text-white ring-4 ring-[#96382B]/20'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {step > item.id ? <CheckCircle2 className="w-4 h-4" /> : item.id}
              </div>
              <span
                className={`text-xs font-medium ${
                  step === item.id ? 'text-zinc-900 font-bold' : 'text-zinc-400'
                }`}
              >
                {item.title}
              </span>
              {idx < 3 && <div className="w-6 h-0.5 bg-zinc-200 mx-1 hidden sm:block" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
        {/* STEP 1: Escolha do Pilar */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-display">
                Em qual pilar de cuidado você atua?
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Selecione a sua área de vocação principal. O TuttiZelo valida certificações específicas para cada categoria.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'babysitter' as CaregiverCategory,
                  title: 'Babá & Infantil',
                  desc: 'Cuidado de bebês, apoio escolar, introdução alimentar e rotinas de desenvolvimento.',
                  icon: <Baby className="w-7 h-7 text-[#96382B]" />,
                },
                {
                  id: 'elderly_care' as CaregiverCategory,
                  title: 'Cuidador(a) de Idosos',
                  desc: 'Apoio a rotinas diárias, medicação oral, locomoção e companhia com respeito e dignidade.',
                  icon: <Heart className="w-7 h-7 text-[#96382B]" />,
                },
                {
                  id: 'pet_sitter' as CaregiverCategory,
                  title: 'Pet Sitter & Passeador',
                  desc: 'Cuidado domiciliar de cães e gatos, enriquecimento ambiental e passeios educativos.',
                  icon: <Dog className="w-7 h-7 text-[#96382B]" />,
                },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    setSelectedSpecialties([]);
                  }}
                  className={`p-5 rounded-2xl border-2 text-left space-y-3 cursor-pointer transition-all ${
                    category === cat.id
                      ? 'border-[#96382B] bg-[#FDF6F4] shadow-sm'
                      : 'border-zinc-200 bg-white hover:border-zinc-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{cat.title}</h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{cat.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Política TuttiZelo de Taxa Justa (10% a 15% sobre os Atendimentos):</span>
              </div>
              <p className="text-zinc-700 leading-relaxed">
                Diferente de agências tradicionais que retêm de 25% a 40%, na TuttiZelo a taxa de serviço do profissional é de apenas 10% a 15%. Ela financia o seguro de acidentes do plantão, a garantia contra calotes (custódia escrow) e a transferência direta via PIX no check-out.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Avançar para Perfil Profissional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Dados Pessoais & Apresentação */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-display">
                Dados Pessoais & Apresentação Profissional
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Famílias e tutores avaliam com carinho a sua trajetória e especialidades.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Nome Completo (como consta no documento oficial)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Amanda Guimarães Ferreira"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Estado (UF)
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white"
                  >
                    {brazilianStates.map((uf) => (
                      <option key={uf} value={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-700 block mb-1">
                    Anos de Experiência Comprovada
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-zinc-700 block">
                      Preço Desejado por Hora (R$/hora)
                    </label>
                    <span className="text-[11px] font-bold text-[#96382B]">Faixa: R$ 12,50 a R$ 18,00/h</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm text-zinc-500 font-bold">R$</span>
                    <input
                      type="number"
                      min="12.5"
                      max="18"
                      step="0.5"
                      value={hourlyRate}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHourlyRate(val);
                        if (val < 12.5 || val > 18) {
                          setRateError('O valor deve ser entre R$ 12,50 e R$ 18,00 por hora.');
                        } else {
                          setRateError('');
                        }
                      }}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border bg-white font-bold transition-all ${
                        rateError ? 'border-rose-500 focus:ring-rose-500' : 'border-zinc-300 focus:border-[#96382B]'
                      }`}
                    />
                  </div>
                  {rateError ? (
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                      {rateError}
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Repasse líquido estimado: ~R$ {(hourlyRate * 0.88).toFixed(2)}/h (taxa média de 12% da plataforma).
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Título em Destaque (Headline)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Enfermeira Geriátrica com foco em reabilitação motora e Alzheimer"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Biografia Profissional & Experiência
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte sobre sua formação, carinho pela profissão, rotinas que domina e diferenciais..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white"
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-2">
                  Selecione suas Especialidades ({category === 'babysitter' ? 'Infantil' : category === 'elderly_care' ? 'Geriátrico' : 'Pets'}):
                </label>
                <div className="flex flex-wrap gap-2">
                  {specialtiesByCategory[category].map((spec) => {
                    const isSelected = selectedSpecialties.includes(spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpecialty(spec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#96382B] text-white shadow-xs'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {spec}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (hourlyRate < 12.5 || hourlyRate > 18) {
                    setRateError('Por favor, defina um valor por hora entre R$ 12,50 e R$ 18,00 antes de continuar.');
                    return;
                  }
                  setStep(3);
                }}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Avançar para Verificação & LGPD</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Multi-state Judicial Check & LGPD Consent */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-display flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>Auditoria Judicial Multi-Estadual & Consentimento LGPD</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Conforme exigência do ecossistema TuttiZelo, todos os profissionais passam por checagem criminal e prova de vida digital.
              </p>
            </div>

            {/* States lived selector */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <label className="text-xs font-bold text-zinc-800 block">
                Em quais Estados brasileiros você morou ou trabalhou nos últimos 5 anos?
              </label>
              <p className="text-[11px] text-zinc-500">
                A TuttiZelo emite certidões criminais negativas no Tribunal de Justiça de cada Estado selecionado para garantir o Selo Nível 2.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {brazilianStates.map((uf) => {
                  const isChecked = statesLived.includes(uf);
                  return (
                    <button
                      key={uf}
                      type="button"
                      onClick={() => toggleStateLived(uf)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      {isChecked ? '✓ ' : ''}{uf}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LGPD Clear Purpose Checkboxes */}
            <div className="space-y-3 p-4 bg-[#FAF7F2] rounded-2xl border border-[#EBDCD7]">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#96382B]" />
                <span>Consentimento Expresso e Específico (Art. 7º, I da LGPD)</span>
              </h3>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentBackgroundCheck}
                  onChange={(e) => setConsentBackgroundCheck(e.target.checked)}
                  className="mt-0.5 rounded text-[#96382B] focus:ring-[#96382B]"
                />
                <div className="text-xs text-zinc-700">
                  <span className="font-semibold text-zinc-900">Consulta de Antecedentes e Certidões: </span>
                  Autorizo a TuttiZelo a consultar certidões cíveis e criminais estaduais e federais nos tribunais de justiça competentes com a finalidade exclusiva de homologação do meu perfil profissional.
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentBiometrics}
                  onChange={(e) => setConsentBiometrics(e.target.checked)}
                  className="mt-0.5 rounded text-[#96382B] focus:ring-[#96382B]"
                />
                <div className="text-xs text-zinc-700">
                  <span className="font-semibold text-zinc-900">Prova de Vida & Biometria Facial: </span>
                  Autorizo a captura e validação da minha selfie em tempo real contra o documento oficial para prevenir fraudes de identidade.
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentTerms}
                  onChange={(e) => setConsentTerms(e.target.checked)}
                  className="mt-0.5 rounded text-[#96382B] focus:ring-[#96382B]"
                />
                <div className="text-xs text-zinc-700">
                  <span className="font-semibold text-zinc-900">Termos de Uso e Política de Taxa Justa (10%-15%): </span>
                  Estou ciente das regras de custódia PIX segura (Escrow) e repasse automático pós-plantão.
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={!consentBackgroundCheck || !consentBiometrics || !consentTerms}
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-[#96382B] hover:bg-[#7D2E23] disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-xs min-h-[44px]"
              >
                <span>Avançar para Revisão Final</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review and Publish */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 font-display flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                <span>Revisão do Perfil e Emissão do Selo</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Veja uma prévia de como seu cartão aparecerá para as famílias e tutores da sua região.
              </p>
            </div>

            {/* Profile Preview Card */}
            <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 text-base">
                      {fullName || 'Seu Nome Completo'}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Verificação Nível 2 Aprovada
                    </span>
                  </div>
                  <p className="text-xs text-[#96382B] font-semibold">
                    {category === 'babysitter' && '👶 Babá & Cuidado Infantil'}
                    {category === 'elderly_care' && '🧓 Cuidador(a) de Idosos'}
                    {category === 'pet_sitter' && '🐾 Pet Sitter & Dog Walker'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {city}, {state} • {yearsExperience} anos de experiência • R$ {hourlyRate},00/h (líquido est.: ~R$ {(hourlyRate * 0.88).toFixed(2)}/h)
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-700 block mb-1">Apresentação:</span>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {headline || 'Profissional dedicado(a) com foco em segurança e acolhimento familiar.'}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-zinc-700 block mb-1">Especialidades:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedSpecialties.length > 0
                    ? selectedSpecialties
                    : specialtiesByCategory[category].slice(0, 3)
                  ).map((s) => (
                    <span key={s} className="px-2 py-1 rounded-md text-xs bg-white border border-zinc-200 text-zinc-800 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Certidões auditadas:</span>
                <div className="flex gap-1.5">
                  {statesLived.map((uf) => (
                    <span key={uf} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                      TJ{uf} OK
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold text-[10px]">
                    Polícia Federal OK
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 flex items-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Concluir Cadastro & Publicar Perfil</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
