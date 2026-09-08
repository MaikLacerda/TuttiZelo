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
        setSuccessMsg('Cadastro realizado! Redirecionando para a sua área profissional...');
        if (onSuccess) {
          onSuccess({
            name: name || email.split('@')[0],
            email,
            userType: 'caregiver',
          });
        }
        setTimeout(() => {
          onClose();
          if (onGoToOnboarding) {
            onGoToOnboarding();
          }
        }, 1000);
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#EBDCD7] relative max-h-[95vh] overflow-y-auto">
        {/* Fechar Modal */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Logo size="md" showSubtitle={false} />
          </div>
          <h3 id="auth-modal-title" className="text-xl font-extrabold text-zinc-900 font-display">
            {mode === 'register' ? 'Criar sua conta segura' : 'Entrar no TuttiZelo'}
          </h3>
          <p className="text-xs text-zinc-500">
            {mode === 'register'
              ? 'Conectando famílias e cuidadores com checagem rigorosa e seguro'
              : 'Acesse seu painel com segurança e transparência'}
          </p>
        </div>

        {/* Alternador de Modo: Família vs Cuidador (apenas no cadastro) */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-zinc-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setUserType('family')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                userType === 'family'
                  ? 'bg-white text-[#96382B] shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Sou Família</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('caregiver')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                userType === 'caregiver'
                  ? 'bg-[#96382B] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Sou Cuidador(a)</span>
            </button>
          </div>
        )}

        {/* Mensagens de Feedback */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Maria Carolina Souza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-700 block mb-1">E-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">WhatsApp / Celular</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="(11) 99999-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">Cidade / Região</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: São Paulo, SP"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-700 block">Senha</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('Link de recuperação enviado para o e-mail cadastrado.')}
                  className="text-[11px] text-[#96382B] hover:underline"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-300 focus:border-[#96382B] focus:ring-1 focus:ring-[#96382B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#96382B] focus:ring-[#96382B]"
              />
              <span className="text-[11px] text-zinc-600 leading-snug">
                Concordo com os <a href="#" className="underline text-zinc-900 font-semibold">Termos de Uso</a>, a <a href="#" className="underline text-zinc-900 font-semibold">Política de Privacidade</a> e o tratamento de dados conforme a <span className="font-semibold text-zinc-900">LGPD</span>.
              </span>
            </label>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#96382B] hover:bg-[#7D2E23] transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {isSubmitting
                ? 'Processando...'
                : mode === 'register'
                ? userType === 'caregiver'
                  ? 'Continuar para Homologação'
                  : 'Criar Minha Conta'
                : 'Acessar Conta'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Alternador Cadastrar / Entrar */}
        <div className="pt-4 border-t border-zinc-100 text-center text-xs text-zinc-500">
          {mode === 'register' ? (
            <p>
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[#96382B] font-bold hover:underline cursor-pointer"
              >
                Entrar agora
              </button>
            </p>
          ) : (
            <p>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[#96382B] font-bold hover:underline cursor-pointer"
              >
                Cadastre-se gratuitamente
              </button>
            </p>
          )}
        </div>

        {/* Garantias de Segurança no Rodapé */}
        <div className="bg-[#FDF6F4] p-3 rounded-xl border border-[#F5D8D0] flex items-center gap-2 text-[11px] text-[#96382B]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Ambiente criptografado com auditoria contínua de segurança TuttiZelo.</span>
        </div>
      </div>
    </div>
  );
};
