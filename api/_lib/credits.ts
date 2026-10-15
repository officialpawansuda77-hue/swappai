import { HttpError } from './http.js';
import { getSupabaseAdmin } from './supabaseAdmin.js';
import { getCostEstimateUsd, getCreditCost, getMaintenance } from './config.js';
import type { AiOperation } from '../../src/shared/plans.js';

export interface BalanceSnapshot {
  plan: string;
  monthlyAllowance: number;
  planCreditsRemaining: number;
  bonusCredits: number;
  available: number;
  periodStart: string;
  periodEnd: string;
}

export async function getBalance(userId: string): Promise<BalanceSnapshot> {
  const supabase = getSupabaseAdmin();
  await supabase.rpc('ensure_credit_balance', { p_user_id: userId });
  const { data, error } = await supabase.from('credit_balances').select('*').eq('user_id', userId).single();
  if (error || !data) throw new HttpError(500, 'balance_unavailable', 'Could not load your credit balance.');

  // Reflect a pending monthly rollover without mutating state on read.
  const rolledOver = new Date(data.period_end) <= new Date();
  const planRemaining = rolledOver ? data.monthly_allowance : data.plan_credits_remaining;
  return {
    plan: data.plan,
    monthlyAllowance: data.monthly_allowance,
    planCreditsRemaining: planRemaining,
    bonusCredits: data.bonus_credits,
    available: planRemaining + data.bonus_credits,
    periodStart: data.period_start,
    periodEnd: data.period_end,
  };
}

export interface MeteredContext {
  generationId: string;
  cost: number;
}

export interface MeteredOutcome<T> {
  result: T;
  /** 'partial' still charges (user got a usable reconstruction). */
  status?: 'succeeded' | 'partial';
  /** Charge less than reserved (e.g. cache hit or skipped steps). */
  creditsUsed?: number;
  model?: string;
  metadata?: Record<string, unknown>;
}

export interface MeteredOptions {
  userId: string;
  operation: AiOperation;
  idempotencyKey: string;
  projectId?: string | null;
  slideId?: string | null;
  model?: string | null;
  inputHash?: string | null;
  metadata?: Record<string, unknown>;
  /** Override cost (must still be >= 0); defaults to app_config credit cost. */
  cost?: number;
}

/**
 * The ONLY way to run a billable AI operation:
 *   check maintenance → reserve credits atomically (idempotent) → run → commit,
 *   or refund automatically if the operation throws.
 */
export async function runMetered<T>(
  opts: MeteredOptions,
  fn: (ctx: MeteredContext) => Promise<MeteredOutcome<T>>
): Promise<{ result: T; generationId: string; creditsUsed: number; status: 'succeeded' | 'partial' }> {
  const maintenance = await getMaintenance();
  if (maintenance.enabled) {
    throw new HttpError(503, 'maintenance', maintenance.message || 'AI features are temporarily paused for maintenance.');
  }

  if (!opts.idempotencyKey || opts.idempotencyKey.length > 200) {
    throw new HttpError(400, 'invalid_idempotency_key', 'A valid request id is required.');
  }

  const supabase = getSupabaseAdmin();
  const cost = opts.cost ?? (await getCreditCost(opts.operation));

  const { data: reservation, error: reserveErr } = await supabase.rpc('reserve_credits', {
    p_user_id: opts.userId,
    p_operation: opts.operation,
    p_cost: cost,
    p_idempotency_key: opts.idempotencyKey,
    p_project_id: opts.projectId ?? null,
    p_slide_id: opts.slideId ?? null,
    p_model: opts.model ?? null,
    p_input_hash: opts.inputHash ?? null,
    p_metadata: opts.metadata ?? {},
  });

  if (reserveErr) {
    console.error('[credits] reserve failed', reserveErr);
    throw new HttpError(500, 'credits_unavailable', 'Could not reserve credits. Please try again.');
  }
  if (!reservation?.success) {
    throw new HttpError(402, 'insufficient_credits', 'You do not have enough AI credits for this action.', {
      required: reservation?.required ?? cost,
      available: reservation?.available ?? 0,
    });
  }
  if (reservation.duplicate) {
    throw new HttpError(409, 'duplicate_request', 'This request is already being processed.', {
      generationId: reservation.generation_id,
      status: reservation.status,
    });
  }

  const generationId: string = reservation.generation_id;
  const started = Date.now();

  try {
    const outcome = await fn({ generationId, cost });
    const status = outcome.status ?? 'succeeded';
    const creditsUsed = Math.max(0, Math.min(cost, outcome.creditsUsed ?? cost));
    const estCost = creditsUsed === 0 ? 0 : await getCostEstimateUsd(opts.operation);

    const { error: commitErr } = await supabase.rpc('commit_generation', {
      p_generation_id: generationId,
      p_status: status,
      p_credits_used: creditsUsed,
      p_model: outcome.model ?? opts.model ?? null,
      p_est_cost_usd: estCost,
      p_latency_ms: Date.now() - started,
      p_metadata: outcome.metadata ?? {},
    });
    if (commitErr) console.error('[credits] commit failed (reservation stays charged)', commitErr);

    return { result: outcome.result, generationId, creditsUsed, status };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const { error: refundErr } = await supabase.rpc('refund_generation', {
      p_generation_id: generationId,
      p_error: message.slice(0, 500),
    });
    if (refundErr) console.error('[credits] refund failed — stale-refund job will retry', refundErr);
    throw err;
  }
}
