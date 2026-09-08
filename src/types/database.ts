/**
 * @license
 * TuttiZelo Platform — Supabase Database Types & Enums
 * Gerado com base no Schema Fase 1 (Nexora/TuttiZelo Tech)
 */

export type AppRole = 'admin' | 'reviewer' | 'support' | 'family' | 'caregiver';

export type VerificationLevel = 'level_1_identity' | 'level_2_background' | 'level_3_plus';

export type VerificationState =
  | 'pending_consent'
  | 'awaiting_input'
  | 'submitted'
  | 'in_progress'
  | 'manual_review'
  | 'approved'
  | 'rejected'
  | 'failed'
  | 'disputed'
  | 'expired'
  | 'revoked';

export type CheckType =
  | 'cpf_status'
  | 'document_ocr'
  | 'liveness_selfie'
  | 'criminal_federal'
  | 'criminal_state'
  | 'bnmp'
  | 'reference_call'
  | 'course_certificate'
  | 'first_aid_certificate';

export type CheckResult = 'pending' | 'clear' | 'adverse' | 'inconclusive' | 'error';

export type ConsentPurpose =
  | 'identity_verification'
  | 'background_check'
  | 'reference_check'
  | 'profile_publication'
  | 'payment_processing'
  | 'communications';

export type DisputeState = 'open' | 'under_review' | 'upheld' | 'overturned' | 'expired';

export type CaregiverCategory = 'babysitter' | 'elderly_care' | 'pet_sitter';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface CaregiverProfile {
  id: string;
  tenant_id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  badges?: CaregiverBadge;
  headline: string | null;
  bio: string | null;
  birth_date: string | null;
  city: string | null;
  state: string | null;
  states_lived: string[]; // ex: ['SP', 'RJ', 'MG'] -> direciona TJs
  hourly_rate_cents: number;
  specialties: string[];
  age_groups: string[]; // 'baby' | '1_3' | '4_6' | '7_plus' ou faixas equivalentes
  availability: {
    morning?: boolean;
    afternoon?: boolean;
    night?: boolean;
    weekend?: boolean;
    overnight?: boolean;
  };
  years_experience: number | null;
  is_published: boolean;
  category: CaregiverCategory;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export type CaregiverWithDetails = CaregiverProfile & {
  full_name: string;
  avatar_url: string;
  badges: CaregiverBadge;
};

export interface FamilyProfile {
  id: string;
  tenant_id: string;
  user_id: string;
  city: string | null;
  state: string | null;
  needs: string[]; // 'ocasional' | 'fds' | 'integral' | 'noturno' | 'emergencia'
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  tenant_id: string;
  family_id: string;
  first_name: string | null;
  birth_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface Consent {
  id: string;
  tenant_id: string;
  user_id: string;
  purpose: ConsentPurpose;
  policy_version: string;
  granted: boolean;
  granted_at: string;
  revoked_at: string | null;
  ip_address?: string;
  user_agent?: string;
}

export interface Holiday {
  day: string; // YYYY-MM-DD
  name: string;
  scope: string;
}

export interface VerificationCase {
  id: string;
  tenant_id: string;
  caregiver_id: string;
  level: VerificationLevel;
  state: VerificationState;
  provider: string | null;
  provider_case_id: string | null;
  idempotency_key: string | null;
  approved_at: string | null;
  valid_until: string | null;
  cost_cents: number;
  decided_by: string | null;
  decision_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationCheck {
  id: string;
  tenant_id: string;
  case_id: string;
  check_type: CheckType;
  jurisdiction: string | null; // UF
  result: CheckResult;
  provider: string | null;
  provider_reference: string | null;
  cost_cents: number;
  requested_at: string;
  completed_at: string | null;
}

export interface VerificationArtifact {
  id: string;
  tenant_id: string;
  case_id: string;
  check_id: string | null;
  storage_bucket: string;
  storage_path: string;
  content_type: string | null;
  sha256: string | null;
  purge_after: string;
  created_at: string;
}

export interface VerificationEvent {
  id: number;
  tenant_id: string;
  case_id: string;
  from_state: VerificationState | null;
  to_state: VerificationState;
  actor_id: string | null;
  actor_kind: 'system' | 'provider' | 'reviewer' | 'caregiver';
  reason: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface VerificationDispute {
  id: string;
  tenant_id: string;
  case_id: string;
  opened_by: string;
  state: DisputeState;
  claim: string;
  deadline_at: string;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
}

export interface CaregiverBadge {
  caregiver_id: string;
  tenant_id: string;
  level_1_verified_at: string | null;
  level_1_valid_until: string | null;
  level_2_verified_at: string | null;
  level_2_valid_until: string | null;
  level_3_verified_at: string | null;
  level_3_valid_until: string | null;
}
