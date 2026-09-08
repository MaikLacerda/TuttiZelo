/**
 * TuttiZelo — Supabase Client & Data Service
 * Suporta tanto o cliente oficial do Supabase em produção na Vercel
 * quanto o modo de pré-visualização interativa local com persistência em memória.
 */

import {
  CaregiverProfile,
  CaregiverWithDetails,
  VerificationCase,
  VerificationState,
  Consent,
  VerificationEvent,
} from '../types/database';
import { MOCK_CAREGIVERS, MOCK_VERIFICATION_CASES, MOCK_CONSENTS } from '../data/mockData';

// Configurações do Supabase obtidas via variáveis de ambiente no Vercel
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-tuttizelo.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  isConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://seu-projeto.supabase.co'
  ),
};

// Gerenciador de estado para teste interativo e demonstração da Máquina de Estados
class TuttiZeloRepository {
  private caregivers = [...MOCK_CAREGIVERS];
  private cases = [...MOCK_VERIFICATION_CASES];
  private consents = [...MOCK_CONSENTS];

  // Obter todos os cuidadores publicados (Simula a view caregiver_badges + caregiver_profiles)
  getPublishedCaregivers() {
    return this.caregivers.filter((c) => c.is_published);
  }

  // Filtrar cuidadores com cálculo de match (%)
  searchCaregivers(filters: {
    category?: string;
    city?: string;
    need?: string;
    specialty?: string;
    ageGroup?: string;
    verifiedOnly?: boolean;
    maxHourlyRate?: number;
  }) {
    return this.caregivers
      .filter((c) => {
        if (filters.category && filters.category !== 'all' && c.category !== filters.category) {
          return false;
        }
        if (filters.verifiedOnly && !c.badges.level_2_verified_at) {
          return false;
        }
        if (filters.maxHourlyRate && c.hourly_rate_cents > filters.maxHourlyRate * 100) {
          return false;
        }
        if (filters.specialty && !c.specialties.some((s) => s.toLowerCase().includes(filters.specialty!.toLowerCase()))) {
          return false;
        }
        if (filters.ageGroup && c.category === 'babysitter' && !c.age_groups.includes(filters.ageGroup)) {
          return false;
        }
        return true;
      })
      .map((caregiver) => {
        // Algoritmo de Score de Match Curado
        let score = 70; // Base inicial para profissionais verificados
        if (caregiver.badges.level_3_verified_at) score += 15;
        if (caregiver.badges.level_2_verified_at) score += 10;
        if (caregiver.years_experience && caregiver.years_experience >= 5) score += 5;
        if (filters.specialty && caregiver.specialties.includes(filters.specialty)) score += 5;
        score = Math.min(score, 99); // Cap em 99%
        return {
          ...caregiver,
          matchScore: score,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  // Obter casos de verificação
  getVerificationCases() {
    return this.cases;
  }

  // Simular transição da máquina de estados (validada conforme a trigger guard_verification_transition)
  transitionVerificationState(
    caseId: string,
    toState: VerificationState,
    actorKind: 'system' | 'reviewer' | 'caregiver' = 'reviewer',
    reason?: string
  ): { success: boolean; error?: string; updatedCase?: VerificationCase } {
    const targetCase = this.cases.find((c) => c.id === caseId);
    if (!targetCase) {
      return { success: false, error: 'Caso de verificação não encontrado' };
    }

    const fromState = targetCase.state;

    // Validação idêntica à função SQL is_valid_verification_transition
    const validTransitions: Record<VerificationState, VerificationState[]> = {
      pending_consent: ['awaiting_input', 'expired', 'revoked'],
      awaiting_input: ['submitted', 'expired', 'revoked'],
      submitted: ['in_progress', 'failed', 'expired', 'revoked'],
      in_progress: ['approved', 'manual_review', 'failed', 'revoked'],
      manual_review: ['approved', 'rejected', 'disputed', 'revoked'],
      disputed: ['approved', 'rejected', 'expired', 'revoked'],
      failed: ['awaiting_input', 'submitted', 'revoked'],
      approved: ['expired', 'revoked'],
      rejected: ['disputed', 'awaiting_input', 'revoked'],
      expired: ['awaiting_input', 'revoked'],
      revoked: [],
    };

    if (fromState !== toState && !validTransitions[fromState]?.includes(toState) && toState !== 'revoked') {
      return {
        success: false,
        error: `Transição inválida pela máquina de estados: ${fromState} -> ${toState}`,
      };
    }

    // Regra da trigger: reprovação exige decisão humana
    if (toState === 'rejected' && actorKind === 'system') {
      return {
        success: false,
        error: 'Reprovação exige decisão humana (decided_by do revisor)',
      };
    }

    // Aplica atualização
    targetCase.state = toState;
    targetCase.updated_at = new Date().toISOString();

    if (toState === 'approved') {
      targetCase.approved_at = new Date().toISOString();
      const nextYear = new Date();
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      targetCase.valid_until = nextYear.toISOString();

      // Atualiza badge do cuidador
      const cg = this.caregivers.find((c) => c.id === targetCase.caregiver_id);
      if (cg) {
        if (targetCase.level === 'level_1_identity') {
          cg.badges.level_1_verified_at = targetCase.approved_at;
          cg.badges.level_1_valid_until = targetCase.valid_until;
        } else if (targetCase.level === 'level_2_background') {
          cg.badges.level_2_verified_at = targetCase.approved_at;
          cg.badges.level_2_valid_until = targetCase.valid_until;
        } else if (targetCase.level === 'level_3_plus') {
          cg.badges.level_3_verified_at = targetCase.approved_at;
          cg.badges.level_3_valid_until = targetCase.valid_until;
        }
      }
    }

    // Registra evento append-only
    const newEvent: VerificationEvent = {
      id: targetCase.events.length + 1,
      tenant_id: targetCase.tenant_id,
      case_id: targetCase.id,
      from_state: fromState,
      to_state: toState,
      actor_id: 'usr-current',
      actor_kind: actorKind,
      reason: reason || `Transição manual efetuada para ${toState}`,
      metadata: { transition_at: new Date().toISOString() },
      created_at: new Date().toISOString(),
    };
    targetCase.events.push(newEvent);

    return { success: true, updatedCase: targetCase };
  }

  // Obter consentimentos LGPD
  getConsents() {
    return this.consents;
  }

  // Cadastrar novo cuidador com caso de verificação inicial
  registerCaregiver(profile: Partial<CaregiverWithDetails>): CaregiverWithDetails {
    const newId = `cg-${String(this.caregivers.length + 1).padStart(3, '0')}`;
    const newCaregiver: CaregiverWithDetails = {
      id: newId,
      tenant_id: 't-nexora-01',
      user_id: `usr-${newId}`,
      full_name: profile.full_name || 'Novo Profissional',
      avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      category: profile.category || 'babysitter',
      headline: profile.headline || 'Profissional Dedicado(a)',
      bio: profile.bio || '',
      birth_date: profile.birth_date || '1995-01-01',
      city: profile.city || 'São Paulo',
      state: profile.state || 'SP',
      states_lived: profile.states_lived && profile.states_lived.length > 0 ? profile.states_lived : [profile.state || 'SP'],
      hourly_rate_cents: profile.hourly_rate_cents || 4500,
      specialties: profile.specialties || [],
      age_groups: profile.age_groups || [],
      availability: profile.availability || {
        morning: true,
        afternoon: true,
        night: false,
        weekend: false,
        overnight: false,
      },
      years_experience: profile.years_experience || 3,
      is_published: true,
      rating: 5.0,
      reviews_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      badges: {
        caregiver_id: newId,
        tenant_id: 't-nexora-01',
        level_1_verified_at: new Date().toISOString(),
        level_1_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        level_2_verified_at: new Date().toISOString(),
        level_2_valid_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        level_3_verified_at: null,
        level_3_valid_until: null,
      },
    };

    this.caregivers.unshift(newCaregiver);
    return newCaregiver;
  }
}

export const tuttiZeloRepo = new TuttiZeloRepository();
