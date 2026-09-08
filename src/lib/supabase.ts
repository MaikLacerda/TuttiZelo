/**
 * TuttiZelo — Supabase Client & Hybrid Data Service
 * Comunica com o banco de dados PostgreSQL do Supabase em produção
 * e mantém fallback resiliente com dados curados em cache para experiência offline/instantânea.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CaregiverProfile,
  CaregiverWithDetails,
  VerificationCase,
  VerificationState,
  Consent,
  VerificationEvent,
} from '../types/database';
import { MOCK_CAREGIVERS, MOCK_VERIFICATION_CASES, MOCK_CONSENTS } from '../data/mockData';

export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  isConfigured: Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_URL.includes('supabase.co') &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    import.meta.env.VITE_SUPABASE_ANON_KEY.length > 20
  ),
};

export const supabase: SupabaseClient | null = SUPABASE_CONFIG.isConfigured
  ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey)
  : null;

class TuttiZeloRepository {
  private caregivers: CaregiverWithDetails[] = [...MOCK_CAREGIVERS];
  private cases: VerificationCase[] = [...MOCK_VERIFICATION_CASES];
  private consents: Consent[] = [...MOCK_CONSENTS];
  private localHirings: any[] = [];
  private isLoadedFromRemote = false;

  constructor() {
    this.initRemoteSync();
  }

  private async initRemoteSync() {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('caregiver_profiles')
        .select('*, caregiver_badges(*)');

      if (!error && data && data.length > 0) {
        const remoteCaregivers: CaregiverWithDetails[] = data.map((item: any) => {
          const badge = item.caregiver_badges?.[0] || {};
          return {
            id: item.id,
            tenant_id: 't-nexora-01',
            user_id: item.user_id || item.id,
            full_name: item.full_name,
            avatar_url: item.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
            category: item.category,
            headline: item.headline,
            bio: item.bio,
            birth_date: item.birth_date || '1995-01-01',
            city: item.city || 'São Paulo',
            state: item.state || 'SP',
            states_lived: item.states_lived || ['SP'],
            hourly_rate_cents: item.hourly_rate_cents,
            specialties: item.specialties || [],
            age_groups: item.age_groups || [],
            availability: item.availability || {
              morning: true,
              afternoon: true,
              night: false,
              weekend: false,
              overnight: false,
            },
            years_experience: item.years_experience || 3,
            is_published: item.is_published ?? true,
            rating: item.rating || 5.0,
            reviews_count: item.reviews_count || 0,
            created_at: item.created_at || new Date().toISOString(),
            updated_at: item.updated_at || new Date().toISOString(),
            badges: {
              caregiver_id: item.id,
              tenant_id: 't-nexora-01',
              level_1_verified_at: badge.level_1_verified_at || new Date().toISOString(),
              level_1_valid_until: badge.level_1_valid_until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              level_2_verified_at: badge.level_2_verified_at || new Date().toISOString(),
              level_2_valid_until: badge.level_2_valid_until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              level_3_verified_at: badge.level_3_verified_at || null,
              level_3_valid_until: badge.level_3_valid_until || null,
            },
          };
        });

        if (remoteCaregivers.length > 0) {
          this.caregivers = remoteCaregivers;
          this.isLoadedFromRemote = true;
        }
      }
    } catch (err) {
      console.warn('[TuttiZelo] Fallback para dados locais:', err);
    }
  }

  getPublishedCaregivers() {
    return this.caregivers.filter((c) => c.is_published);
  }

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
        let score = 70;
        if (caregiver.badges.level_3_verified_at) score += 15;
        if (caregiver.badges.level_2_verified_at) score += 10;
        if (caregiver.years_experience && caregiver.years_experience >= 5) score += 5;
        if (filters.specialty && caregiver.specialties.includes(filters.specialty)) score += 5;
        score = Math.min(score, 99);
        return {
          ...caregiver,
          matchScore: score,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }

  getVerificationCases() {
    return this.cases;
  }

  transitionVerificationState(
    caseId: string,
    toState: VerificationState,
    actorKind: 'system' | 'reviewer' | 'caregiver' = 'reviewer',
    reason?: string
  ): { success: boolean; error?: string; updatedCase?: VerificationCase } {
    const targetCase = this.cases.find((c) => c.id === caseId);
    if (!targetCase) {
      return { success: false, error: 'Caso não encontrado' };
    }

    const fromState = targetCase.state;
    targetCase.state = toState;
    targetCase.updated_at = new Date().toISOString();

    if (toState === 'approved') {
      targetCase.approved_at = new Date().toISOString();
      targetCase.valid_until = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    const newEvent: VerificationEvent = {
      id: targetCase.events.length + 1,
      tenant_id: targetCase.tenant_id,
      case_id: targetCase.id,
      from_state: fromState,
      to_state: toState,
      actor_id: actorKind === 'reviewer' ? 'rev-01' : null,
      actor_kind: actorKind,
      reason: reason || `Transição para ${toState}`,
      metadata: {},
      created_at: new Date().toISOString(),
    };
    targetCase.events.push(newEvent);

    return { success: true, updatedCase: targetCase };
  }

  getConsents() {
    return this.consents;
  }

  async registerCaregiver(profile: Partial<CaregiverWithDetails>): Promise<CaregiverWithDetails> {
    const newId = `cg-${Date.now().toString().slice(-6)}`;
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
      hourly_rate_cents: profile.hourly_rate_cents || 1500,
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

    if (supabase) {
      try {
        const { data: insertedProfile, error: profileErr } = await supabase
          .from('caregiver_profiles')
          .insert([
            {
              full_name: newCaregiver.full_name,
              category: newCaregiver.category,
              headline: newCaregiver.headline,
              bio: newCaregiver.bio,
              city: newCaregiver.city,
              state: newCaregiver.state,
              years_experience: newCaregiver.years_experience,
              hourly_rate_cents: newCaregiver.hourly_rate_cents,
              avatar_url: newCaregiver.avatar_url,
              specialties: newCaregiver.specialties,
              states_lived: newCaregiver.states_lived,
              age_groups: newCaregiver.age_groups,
              is_published: true,
            },
          ])
          .select()
          .single();

        if (!profileErr && insertedProfile) {
          await supabase.from('caregiver_badges').insert([
            {
              caregiver_id: insertedProfile.id,
              level_1_verified_at: new Date().toISOString(),
              level_2_verified_at: new Date().toISOString(),
            },
          ]);
          newCaregiver.id = insertedProfile.id;
        }
      } catch (e) {
        console.warn('[Supabase] Erro ao persistir:', e);
      }
    }

    return newCaregiver;
  }

  async recordHiring(hiringData: {
    caregiverId: string;
    familyName: string;
    familyEmail: string;
    familyPhone?: string;
    category: string;
    shiftDate: string;
    shiftStartTime: string;
    shiftEndTime: string;
    hours: number;
    hourlyRateCents: number;
    grossAmountCents: number;
    platformFeeCents: number;
    insuranceFeeCents: number;
    totalAmountCents: number;
    caregiverNetAmountCents: number;
  }) {
    const newHiring = {
      id: `hire-${Date.now().toString().slice(-6)}`,
      caregiver_id: hiringData.caregiverId,
      family_name: hiringData.familyName,
      family_email: hiringData.familyEmail,
      family_phone: hiringData.familyPhone || '(11) 98765-4321',
      category: hiringData.category,
      shift_date: hiringData.shiftDate,
      shift_start_time: hiringData.shiftStartTime,
      shift_end_time: hiringData.shiftEndTime,
      hours: hiringData.hours,
      hourly_rate_cents: hiringData.hourlyRateCents,
      gross_amount_cents: hiringData.grossAmountCents,
      platform_fee_cents: hiringData.platformFeeCents,
      insurance_fee_cents: hiringData.insuranceFeeCents,
      total_amount_cents: hiringData.totalAmountCents,
      caregiver_net_amount_cents: hiringData.caregiverNetAmountCents,
      status: 'escrow_locked',
      created_at: new Date().toISOString(),
    };

    this.localHirings.unshift(newHiring);

    if (supabase) {
      try {
        const { error } = await supabase.from('hirings').insert([
          {
            caregiver_id: hiringData.caregiverId,
            family_name: hiringData.familyName,
            family_email: hiringData.familyEmail,
            family_phone: hiringData.familyPhone || null,
            category: hiringData.category,
            shift_date: hiringData.shiftDate,
            shift_start_time: hiringData.shiftStartTime,
            shift_end_time: hiringData.shiftEndTime,
            hours: hiringData.hours,
            hourly_rate_cents: hiringData.hourlyRateCents,
            gross_amount_cents: hiringData.grossAmountCents,
            platform_fee_cents: hiringData.platformFeeCents,
            insurance_fee_cents: hiringData.insuranceFeeCents,
            total_amount_cents: hiringData.totalAmountCents,
            caregiver_net_amount_cents: hiringData.caregiverNetAmountCents,
            status: 'escrow_locked',
          },
        ]);
        return { success: !error, error, hiring: newHiring };
      } catch (err) {
        console.warn('[Supabase] Erro ao gravar contratação:', err);
      }
    }
    return { success: true, hiring: newHiring };
  }

  async getHiringsByCaregiver(caregiverId: string) {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('hirings')
          .select('*')
          .eq('caregiver_id', caregiverId)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[Supabase] Erro ao buscar contratações:', err);
      }
    }
    return this.localHirings.filter((h) => h.caregiver_id === caregiverId);
  }
}

export const tuttiZeloRepo = new TuttiZeloRepository();
