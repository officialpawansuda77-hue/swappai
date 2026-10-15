// Single source of truth for plans, limits and AI credit costs.
// Imported by BOTH the browser bundle and the /api server functions.
// Server-side, values here are DEFAULTS — admins override them at runtime via
// the `app_config` table (keys: 'plan_limits', 'credit_costs'), no redeploy needed.

export type PlanId = 'free' | 'creator' | 'pro' | 'business' | 'agency';

/** Legacy plan ids stored in older `profiles.plan` rows. */
const LEGACY_PLAN_ALIASES: Record<string, PlanId> = {
  starter: 'free',
  studio: 'pro',
};

export function normalizePlanId(raw: string | null | undefined): PlanId {
  if (!raw) return 'free';
  if (raw in LEGACY_PLAN_ALIASES) return LEGACY_PLAN_ALIASES[raw];
  return (['free', 'creator', 'pro', 'business', 'agency'] as const).includes(raw as PlanId)
    ? (raw as PlanId)
    : 'free';
}

export interface PlanLimits {
  monthlyCredits: number;
  /** null = unlimited */
  maxProjects: number | null;
  /** null = unlimited (still bounded by credits) */
  monthlyRemixes: number | null;
  teamMembers: number;
  brandKits: number;
  watermark: boolean;
  hdExport: boolean;
  bulkExport: boolean;
  premiumTemplates: boolean;
  priorityProcessing: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
}

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceInr: number;
  tagline: string;
  features: string[];
  limits: PlanLimits;
  isPopular?: boolean;
}

export const PLAN_ORDER: PlanId[] = ['free', 'creator', 'pro', 'business', 'agency'];

export const PLAN_DEFINITIONS: Record<PlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    priceInr: 0,
    tagline: 'Try the reconstruction workflow.',
    features: ['5 AI credits / month', '3 projects', 'Basic editor & templates', 'Limited exports (watermarked)'],
    limits: {
      monthlyCredits: 5, maxProjects: 3, monthlyRemixes: 0, teamMembers: 1, brandKits: 0,
      watermark: true, hdExport: false, bulkExport: false, premiumTemplates: false,
      priorityProcessing: false, apiAccess: false, whiteLabel: false,
    },
  },
  creator: {
    id: 'creator',
    name: 'Creator',
    priceInr: 699,
    tagline: 'For a consistent content engine.',
    features: ['100 AI credits / month', '30 projects', '10 AI Remix operations', 'Premium templates', 'HD export, no watermark'],
    isPopular: true,
    limits: {
      monthlyCredits: 100, maxProjects: 30, monthlyRemixes: 10, teamMembers: 1, brandKits: 1,
      watermark: false, hdExport: true, bulkExport: false, premiumTemplates: true,
      priorityProcessing: false, apiAccess: false, whiteLabel: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceInr: 1999,
    tagline: 'For serious creators and founders.',
    features: ['400 AI credits / month', 'Unlimited projects', '50 AI Remix operations', 'Brand Kit', 'Bulk export', 'Priority processing'],
    limits: {
      monthlyCredits: 400, maxProjects: null, monthlyRemixes: 50, teamMembers: 1, brandKits: 1,
      watermark: false, hdExport: true, bulkExport: true, premiumTemplates: true,
      priorityProcessing: true, apiAccess: false, whiteLabel: false,
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    priceInr: 5999,
    tagline: 'For teams shipping content daily.',
    features: ['1,500 AI credits / month', '5 team members', 'Multiple Brand Kits', 'Bulk carousel generation', 'Advanced AI redesign'],
    limits: {
      monthlyCredits: 1500, maxProjects: null, monthlyRemixes: null, teamMembers: 5, brandKits: 5,
      watermark: false, hdExport: true, bulkExport: true, premiumTemplates: true,
      priorityProcessing: true, apiAccess: false, whiteLabel: false,
    },
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    priceInr: 14999,
    tagline: 'For agencies running client accounts.',
    features: ['5,000 AI credits / month', '15 team members', 'Multiple workspaces', 'Client projects', 'API access', 'White-label exports'],
    limits: {
      monthlyCredits: 5000, maxProjects: null, monthlyRemixes: null, teamMembers: 15, brandKits: 25,
      watermark: false, hdExport: true, bulkExport: true, premiumTemplates: true,
      priorityProcessing: true, apiAccess: true, whiteLabel: true,
    },
  },
};

// ---- AI credit costs ---------------------------------------------------------
// Manual editor operations (text, font, colour, move, resize, layers…) cost ZERO.

export type AiOperation = 'analysis' | 'reconstruction' | 'background_edit' | 'remix' | 'redesign';

export const DEFAULT_CREDIT_COSTS: Record<AiOperation, number> = {
  analysis: 1,
  reconstruction: 3,
  background_edit: 6,
  remix: 6,
  redesign: 15,
};

/** Operations at/above this cost require an explicit confirmation in the UI. */
export const CONFIRM_THRESHOLD_CREDITS = 3;

export const AI_OPERATION_LABELS: Record<AiOperation, string> = {
  analysis: 'Carousel analysis',
  reconstruction: 'Complex reconstruction',
  background_edit: 'Background / text removal',
  remix: 'AI Remix',
  redesign: 'Full AI redesign',
};

// ---- Upload limits (defaults; overridable via app_config 'upload_limits') ----

export const DEFAULT_UPLOAD_LIMITS = {
  maxSlides: 10,
  maxFileMb: 10,
  allowedMime: ['image/png', 'image/jpeg', 'image/webp'] as string[],
};

export const CANVAS_FORMATS = {
  portrait: { width: 1080, height: 1350, label: '4:5 Portrait' },
  square: { width: 1080, height: 1080, label: '1:1 Square' },
  story: { width: 1080, height: 1920, label: '9:16 Story' },
} as const;

export type CanvasFormat = keyof typeof CANVAS_FORMATS;

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
