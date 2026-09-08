import React, { useState } from 'react';
import {
  X,
  Heart,
  Briefcase,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Logo } from '../brand/Logo';

export type AuthMode = 'register' | 'login';
export type UserType = 'family' | 'caregiver';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  initialUserType?: UserType;
  onSuccess?: (userData: { name: string; email: string; userType: UserType }) => void;
  onGoToOnboarding?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  initialUserType = 'family',
  onSuccess,
  onGoToOnboarding,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [userType, setUserType] = useState<UserType>(initialUserType);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha os campos de e-mail e senha.');
      return;
    }

    if (mode === 'register') {
      if (!name) {
        setErrorMsg('Informe seu nome completo.');
        return;
      }
      if (!phone) {
        setErrorMsg('Informe um número de WhatsApp ou celular para contato.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('É necessário concordar com os Termos de Uso e Política de Privacidade.');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (mode === 'register' && userType === 'caregiver') {
        setSuccessMsg("Cadastro realizado! Redirecionando para a sua área profissional..."); if (onSuccess) { onSuccess({ name: name || email.split("@")[0], email, userType: "caregiver" }); }');
        setTimeout(() => {
          onClose();
          if (onGoToOnboarding) {
            onGoToOnboarding();
          }
        }, 1200);
      } else {
        setSuccessMsg(
          mode === 'register'
            ? 'Conta criada com sucesso no TuttiZelo!'
            : 'Bem-vindo(a) de volta ao TuttiZelo!'
        );
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({
              name: name || email.split('@')[0],
              email,
              userType,
            });
          }
          onClose();
        }, 900);
      }
    }, 700);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#EBDCD7] relative max-h-[94vh] flex flex-col"
      >
        {/* Header com Logo & Fechar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0E4DF] bg-white sticky top-0 z-10">
          <Logo size="sm" showSubtitle={false} />
          <button
            type="button"
            onClick={onClose}
            id="auth-modal-close-btn"
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal com Scroll */}
        <div className="overflow-y-auto px-6 py-6 space-y-6">
          {/* Seletor de Tipo de Usuário (Apenas no Cadastro) */}
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Você quer utilizar o TuttiZelo como:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="select-user-family-btn"
                  onClick={() => setUserType('family')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    userType === 'family'
                      ? 'border-[#96382B] bg-[#FDF8F6] ring-2 ring-[#96382B]/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      userType === 'family' ? 'bg-[#96382B] text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-xs sm:text-sm">Família</h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      Quero contratar babá, cuidador ou pet sitter.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  id="select-user-caregiver-btn"
                  onClick={() => setUserType('caregiver')}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                    userType === 'caregiver'
                      ? 'border-[#96382B] bg-[#FDF8F6] ring-2 ring-[#96382B]/20'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      userType === 'caregiver' ? 'bg-[#96382B] text-white' : 'bg-zinc-100 text-zinc-600'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 text-xs sm:text-sm">Cuidador(a)</h3>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">
                      Quero trabalhar e receber com segurança.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Título & Subtítulo */}
          <div className="text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
              {mode === 'register'
                ? userType === 'family'
                  ? 'Crie sua conta no TuttiZelo'
                  : 'Cadastro de Cuidador(a)'
                : 'Entre na sua conta'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              {mode === 'register'
                ? userType === 'family'
                  ? 'Encontre profissionais verificados com antecedentes checados.'
                  : 'Receba propostas de famílias da sua região e receba semanalmente.'
                : 'Digite seus dados de acesso.'}
            </p>
          </div>

          {/* Mensagens de Alerta / Sucesso */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      id="auth-name-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Mariana Silva"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#96382B]/20 focus:border-[#96382B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      WhatsApp / Celular *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        id="auth-phone-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#96382B]/20 focus:border-[#96382B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Cidade / Bairro
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        id="auth-city-input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Pinheiros, SP"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#96382B]/20 focus:border-[#96382B]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="auth-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#96382B]/20 focus:border-[#96382B]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-zinc-700">Senha *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Em breve recuperação de senha por e-mail e SMS!')}
                    className="text-xs text-[#96382B] hover:underline cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#96382B]/20 focus:border-[#96382B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="auth-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#96382B] focus:ring-[#96382B] cursor-pointer"
                />
                <label htmlFor="auth-agree-terms" className="text-[11px] text-zinc-600 leading-snug">
                  Concordo com os{' '}
                  <span className="text-[#96382B] font-semibold underline cursor-pointer">
                    Termos de Uso
                  </span>{' '}
                  e confirmo o tratamento seguro dos meus dados conforme a LGPD.
                </label>
              </div>
            )}

            {/* Botão Principal de Ação */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isSubmitting}
              className="w-full py-3 px-6 rounded-xl bg-[#96382B] hover:bg-[#7D2E23] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50 mt-2"
            >
              {isSubmitting ? (
                <span>Processando...</span>
              ) : (
                <>
                  <span>
                    {mode === 'register'
                      ? userType === 'family'
                        ? 'Criar Conta de Família'
                        : 'Prosseguir Cadastro de Cuidador'
                      : 'Entrar no TuttiZelo'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Garantia de Segurança */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 py-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Seus dados são 100% protegidos e confidenciais</span>
          </div>

          {/* Alternador Entre Login e Cadastro */}
          <div className="border-t border-[#F0E4DF] pt-4 text-center">
            {mode === 'register' ? (
              <p className="text-xs text-zinc-600">
                Já tem cadastro no TuttiZelo?{' '}
                <button
                  type="button"
                  id="switch-to-login-btn"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className="text-[#96382B] font-bold hover:underline cursor-pointer ml-1"
                >
                  Entrar
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-600">
                Ainda não tem conta?{' '}
                <button
                  type="button"
                  id="switch-to-register-btn"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className="text-[#96382B] font-bold hover:underline cursor-pointer ml-1"
                >
                  Cadastre-se grátis
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
