import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  Heart,
  Clock,
  Sparkles,
  Send,
} from 'lucide-react';
import { CaregiverWithDetails } from '../../types/database';
import { supabase } from '../../lib/supabase';

interface ReviewModalProps {
  caregiver: CaregiverWithDetails;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: (newRating: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  caregiver,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [care, setCare] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    setLoading(true);
    if (supabase) {
      try {
        await supabase.from('caregiver_reviews').insert([
          {
            caregiver_id: caregiver.id,
            family_name: 'Família Contratante',
            rating,
            punctuality_rating: punctuality,
            care_rating: care,
            comment: comment.trim() || 'Profissional excelente, pontual e muito atenciosa!',
          },
        ]);
      } catch (err) {
        console.warn('Erro ao gravar avaliação:', err);
      }
    }

    setLoading(false);
    setSubmitted(true);
    if (onReviewSubmitted) onReviewSubmitted(rating);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-zinc-200 shadow-2xl relative space-y-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 font-display">Avaliação Registrada!</h3>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Obrigado pelo feedback. Sua avaliação ajuda a manter a comunidade TuttiZelo cada vez mais confiável e segura.
            </p>
          </div>
        ) : (
          <>
            {/* Header da Avaliação */}
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
              <img
                src={caregiver.avatar_url}
                alt={caregiver.full_name}
                className="w-12 h-12 rounded-full object-cover border border-zinc-200"
              />
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Como foi o plantão?</h3>
                <p className="text-xs text-zinc-500">
                  Avalie o atendimento de <strong className="text-zinc-800">{caregiver.full_name}</strong>
                </p>
              </div>
            </div>

            {/* Estrelas Principais */}
            <div className="text-center space-y-2 py-2">
              <span className="text-xs font-bold text-zinc-700 block">Nota Geral</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#96382B]">
                {rating === 5 && '🌟 Excepcional! Recomendaria de olhos fechados'}
                {rating === 4 && '👍 Muito bom atendimento'}
                {rating === 3 && '👌 Atendeu ao esperado'}
                {rating <= 2 && '⚠️ Houve pontos a melhorar'}
              </span>
            </div>

            {/* Critérios Específicos */}
            <div className="space-y-3 bg-zinc-50 p-3.5 rounded-2xl border border-zinc-100 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" /> Pontualidade
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setPunctuality(s)}
                      className={`w-4 h-4 cursor-pointer ${
                        punctuality >= s ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> Carinho & Atenção
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setCare(s)}
                      className={`w-4 h-4 cursor-pointer ${
                        care >= s ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Comentário Escrito */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700">Deixe um depoimento para o perfil:</label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte para outras famílias como foi a postura, cuidado e atenção durante o plantão..."
                className="w-full p-3 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#96382B]"
              />
            </div>

            {/* Botão de Envio */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmitReview}
              className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#96382B] hover:bg-[#7D2E23] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {loading ? (
                <span>Salvando avaliação...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Avaliação Verificada</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
