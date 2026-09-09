import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  User,
  MapPin,
  DollarSign,
  Clock,
  ArrowRight,
  ArrowLeft,
  Upload,
  Camera,
  HeartHandshake,
  Check,
  Award,
  Sparkles,
  Info,
  Calendar,
  Briefcase,
  GraduationCap,
  Plus,
  X,
  UploadCloud,
  Image as ImageIcon,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { VerificationBadge } from '../brand/Badge';

interface CaregiverOnboardingProps {
  onSuccess: (newCaregiver: Partial<CaregiverWithDetails>) => void;
  onCancel?: () => void;
}

export const CaregiverOnboarding: React.FC<CaregiverOnboardingProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form Data
  const [formData, setFormData] = useState({
    full_name: '',
    cpf: '',
    birth_date: '',
    category: 'babysitter' as 'babysitter' | 'elderly_care' | 'pet_sitter',
    headline: '',
    bio: '',
    city: 'São Paulo',
    state: 'SP',
    hourly_rate_cents: 1500, // R$ 15,00
    years_experience: 3,
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    consentJudicial: false,
    consentFacial: false,
  });

  // Estados para Upload Real de Documentos e Selfie
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docPreview, setDocPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const [specialties, setSpecialties] = useState<string[]>([]);
  const [newSpecialty, setNewSpecialty] = useState('');

  const defaultSpecialtiesByCategory: Record<string, string[]> = {
    babysitter: ['Primeiros Socorros Infantil', 'Recém-nascidos', 'Rotina Noturna', 'Atividades Lúdicas'],
    elderly_care: ['Acompanhamento Hospitalar', 'Mobilidade Reduzida', 'Administração de Medicação', 'Alzheimer / Parkinson'],
    pet_sitter: ['Cães Idosos', 'Administração de Medicamentos Orais', 'Adestramento Básico', 'Passeios Educativos'],
  };

  const addSpecialty = (spec: string) => {
    if (spec && !specialties.includes(spec)) {
      setSpecialties([...specialties, spec]);
    }
  };

  const removeSpecialty = (spec: string) => {
    setSpecialties(specialties.filter((s) => s !== spec));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submissão Final
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onSuccess({
          full_name: formData.full_name,
          category: formData.category,
          headline: formData.headline || `${formData.category === 'babysitter' ? 'Babá' : formData.category === 'elderly_care' ? 'Cuidadora de Idosos' : 'Pet Sitter'} Profissional`,
          bio: formData.bio || 'Profissional dedicada e experiente, com histórico de confiança e foco na segurança.',
          birth_date: formData.birth_date || '1995-05-12',
          city: formData.city,
          state: formData.state,
          states_lived: [formData.state],
          hourly_rate_cents: formData.hourly_rate_cents,
          specialties: specialties.length > 0 ? specialties : defaultSpecialtiesByCategory[formData.category],
          years_experience: formData.years_experience,
          avatar_url: formData.avatar_url,
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header do Onboarding */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#96382B]/10 text-[#96382B]">
            <ShieldCheck className="w-3.5 h-3.5" /> Credenciamento Profissional TuttiZelo
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-display">
            Seja um(a) Cuidador(a) Homologado(a)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto">
            Faça parte da rede mais segura de cuidados familiares do Brasil com remuneração transparente e garantia de recebimento via PIX.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { step: 1, label: 'Perfil' },
            { step: 2, label: 'Tarifa' },
            { step: 3, label: 'Documentos' },
            { step: 4, label: 'Auditoria' },
          ].map((item) => (
            <div key={item.step} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= item.step ? 'bg-[#96382B]' : 'bg-zinc-200'
                }`}
              />
              <p
                className={`text-[11px] font-bold text-center ${
                  currentStep >= item.step ? 'text-[#96382B]' : 'text-zinc-400'
                }`}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBDCD7] shadow-xs space-y-6">
          {/* ETAPA 1: Dados Pessoais & Categoria */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                1. Informações Básicas
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Selecione sua Especialidade Principal <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'babysitter', label: 'Babá Infantil', icon: '👶' },
                    { id: 'elderly_care', label: 'Cuidador de Idosos', icon: '👵' },
                    { id: 'pet_sitter', label: 'Pet Sitter', icon: '🐾' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id as any })}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        formData.category === cat.id
                          ? 'border-[#96382B] bg-[#96382B]/5 text-[#96382B] font-bold'
                          : 'border-zinc-200 hover:border-zinc-300 text-zinc-600'
                      }`}
                    >
                      <div className="text-xl mb-1">{cat.icon}</div>
                      <div className="text-xs">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Nome Completo <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Ex: Mariana Silva Esteves"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    CPF <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Data de Nascimento <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Cidade</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Estado</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B] bg-white"
                  >
                    <option value="SP">São Paulo (SP)</option>
                    <option value="RJ">Rio de Janeiro (RJ)</option>
                    <option value="MG">Minas Gerais (MG)</option>
                    <option value="PR">Paraná (PR)</option>
                    <option value="SC">Santa Catarina (SC)</option>
                    <option value="RS">Rio Grande do Sul (RS)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Título do Perfil (Headline)
                </label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="Ex: Pedagoga com 5 anos de experiência e Primeiros Socorros"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B]"
                />
              </div>
            </div>
          )}

          {/* ETAPA 2: Tarifação e Especialidades */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                2. Remuneração e Experiência
              </h3>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900">Sua Tarifa por Hora</span>
                  <span className="text-lg font-black text-[#96382B]">
                    R$ {(formData.hourly_rate_cents / 100).toFixed(2).replace('.', ',')} / hora
                  </span>
                </div>
                <input
                  type="range"
                  min="1250"
                  max="1800"
                  step="50"
                  value={formData.hourly_rate_cents}
                  onChange={(e) => setFormData({ ...formData, hourly_rate_cents: Number(e.target.value) })}
                  className="w-full accent-[#96382B] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
                  <span>Mínimo ético: R$ 12,50/h</span>
                  <span>Teto recomendado: R$ 18,00/h</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Anos de Experiência Comprovada
                </label>
                <select
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:border-[#96382B] bg-white"
                >
                  <option value={1}>1 a 2 anos</option>
                  <option value={3}>3 a 5 anos</option>
                  <option value={6}>6 a 10 anos</option>
                  <option value={11}>Mais de 10 anos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Especialidades e Habilidades
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {defaultSpecialtiesByCategory[formData.category]?.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => (specialties.includes(spec) ? removeSpecialty(spec) : addSpecialty(spec))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        specialties.includes(spec)
                          ? 'bg-[#96382B] text-white'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {specialties.includes(spec) ? '✓ ' : '+ '}
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: Upload Real de Documentos e Selfie */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-2">
                3. Checagem de Antecedentes & Biometria
              </h3>

              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  Envio de Documentação e Prova de Vida
                  <span className="text-rose-600 ml-1">*</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload do Documento */}
                  <div className="relative border-2 border-dashed border-zinc-300 rounded-2xl p-5 text-center bg-zinc-50/70 hover:bg-zinc-100/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      id="doc-upload-input"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocFile(file);
                          if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = () => setDocPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          } else {
                            setDocPreview(null);
                          }
                        }
                      }}
                    />
                    {docPreview ? (
                      <div className="space-y-2">
                        <img
                          src={docPreview}
                          alt="Prévia do Documento"
                          className="w-full h-24 object-cover rounded-xl border border-zinc-200"
                        />
                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Documento anexado</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate">{docFile?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <UploadCloud className="w-8 h-8 text-[#96382B] mx-auto mb-1" />
                        <p className="text-xs font-bold text-zinc-800">Documento Oficial com Foto</p>
                        <p className="text-[11px] text-zinc-500">RG ou CNH (Frente e verso)</p>
                        <span className="inline-block px-3 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-2xs">
                          {docFile ? docFile.name : 'Selecionar Arquivo'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Upload da Selfie */}
                  <div className="relative border-2 border-dashed border-zinc-300 rounded-2xl p-5 text-center bg-zinc-50/70 hover:bg-zinc-100/60 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      id="selfie-upload-input"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelfieFile(file);
                          const reader = new FileReader();
                          reader.onload = () => {
                            const result = reader.result as string;
                            setSelfiePreview(result);
                            setFormData((prev) => ({ ...prev, avatar_url: result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {selfiePreview ? (
                      <div className="space-y-2">
                        <img
                          src={selfiePreview}
                          alt="Prévia da Selfie"
                          className="w-20 h-20 object-cover rounded-full mx-auto border-2 border-emerald-500 shadow-xs"
                        />
                        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Selfie Confirmada</span>
                        </div>
                        <p className="text-[10px] text-zinc-400 truncate">{selfieFile?.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Camera className="w-8 h-8 text-[#96382B] mx-auto mb-1" />
                        <p className="text-xs font-bold text-zinc-800">Selfie (Prova de Vida)</p>
                        <p className="text-[11px] text-zinc-500">Tire uma foto ou envie do celular</p>
                        <span className="inline-block px-3 py-1 rounded-lg bg-white border border-zinc-200 text-[11px] font-semibold text-zinc-700 shadow-2xs">
                          {selfieFile ? selfieFile.name : 'Tirar ou Enviar Foto'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Ao enviar seus documentos e consentir, o sistema gera seu hash auditável e libera seu <strong>Selo Nível 2 (Verificado)</strong>.
                  </span>
                </div>
              </div>

              {/* Consentimentos LGPD */}
              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentJudicial}
                    onChange={(e) => setFormData({ ...formData, consentJudicial: e.target.checked })}
                    className="mt-1 h-4 w-4 text-[#96382B] rounded border-zinc-300 focus:ring-[#96382B]"
                  />
                  <span className="text-xs text-zinc-600">
                    Autorizo a <strong>TuttiZelo</strong> a consultar certidões de antecedentes criminais e registros nos Tribunais de Justiça estaduais e federais conforme as diretrizes da LGPD (Art. 7º, II e IX).
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentFacial}
                    onChange={(e) => setFormData({ ...formData, consentFacial: e.target.checked })}
                    className="mt-1 h-4 w-4 text-[#96382B] rounded border-zinc-300 focus:ring-[#96382B]"
                  />
                  <span className="text-xs text-zinc-600">
                    Concordo com a conferência biométrica facial (cruzamento do documento oficial com a selfie) para proteção da integridade da plataforma.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ETAPA 4: Auditoria e Conclusão */}
          {currentStep === 4 && (
            <div className="space-y-4 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-zinc-900 font-display">Tudo Pronto para a Publicação!</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Seus dados foram validados e o seu perfil já receberá o Selo TuttiZelo com validade de 12 meses.
                </p>
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-left space-y-2 max-w-md mx-auto">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Nome:</span>
                  <span className="font-bold text-zinc-800">{formData.full_name || 'Mariana Silva'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Categoria:</span>
                  <span className="font-bold text-zinc-800">
                    {formData.category === 'babysitter' ? 'Babá Infantil' : formData.category === 'elderly_care' ? 'Cuidador(a) de Idosos' : 'Pet Sitter'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Tarifa Registrada:</span>
                  <span className="font-bold text-emerald-700">
                    R$ {(formData.hourly_rate_cents / 100).toFixed(2).replace('.', ',')} / hora
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500">Selo Obtido:</span>
                  <span className="font-bold text-[#96382B]">Nível 2 (Verificado & Auditado)</span>
                </div>
              </div>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={
                loading ||
                (currentStep === 1 && !formData.full_name) ||
                (currentStep === 3 && (!formData.consentJudicial || !formData.consentFacial))
              }
              onClick={handleNextStep}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs ${
                loading ||
                (currentStep === 1 && !formData.full_name) ||
                (currentStep === 3 && (!formData.consentJudicial || !formData.consentFacial))
                  ? 'bg-zinc-300 cursor-not-allowed'
                  : 'bg-[#96382B] hover:bg-[#7D2E23]'
              }`}
            >
              {loading ? (
                <span>Criando seu perfil...</span>
              ) : currentStep === 4 ? (
                <>
                  <span>Concluir e Ir para Meu Painel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
