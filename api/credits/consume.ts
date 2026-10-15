// POST /api/credits/consume  { operation, idempotencyKey, projectId?, slideId? }
// Charges the caller's OWN credits for an operation and records a generation.
// AI endpoints charge internally via runMetered(); this route exists for flows
// that bill an action without a server-side AI call. It can never charge
// another user (identity comes only from the JWT).
import { route, readJson, HttpError } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import { runMetered, getBalance } from '../_lib/credits.js';
import { DEFAULT_CREDIT_COSTS, type AiOperation } from '../../src/shared/plans.js';

const UUID_RE = /^[0-9a-f-]{36}$/i;

export default route(['POST'], async (req, res) => {
  const user = await requireUser(req);
  const body = readJson<{ operation?: string; idempotencyKey?: string; projectId?: string; slideId?: string }>(req);

  if (!body.operation || !(body.operation in DEFAULT_CREDIT_COSTS)) {
    throw new HttpError(400, 'invalid_operation', 'Unknown AI operation.');
  }
  if (!body.idempotencyKey) throw new HttpError(400, 'invalid_idempotency_key', 'idempotencyKey is required.');

  const { generationId, creditsUsed } = await runMetered(
    {
      userId: user.id,
      operation: body.operation as AiOperation,
      idempotencyKey: body.idempotencyKey,
      projectId: body.projectId && UUID_RE.test(body.projectId) ? body.projectId : null,
      slideId: body.slideId && UUID_RE.test(body.slideId) ? body.slideId : null,
      metadata: { via: 'credits/consume' },
    },
    async () => ({ result: null })
  );

  const balance = await getBalance(user.id);
  res.status(200).json({ success: true, generationId, creditsUsed, available: balance.available });
});
