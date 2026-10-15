// POST /api/subscription/consume-generation — LEGACY endpoint.
// Now charges `analysis` credits through the central metered pipeline.
// Identity comes only from the Bearer JWT (body.userId is ignored).
import { randomUUID } from 'crypto';
import { route, readJson } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import { runMetered, getBalance } from '../_lib/credits.js';

export default route(['POST'], async (req, res) => {
  const user = await requireUser(req);
  const body = readJson<{ requestId?: string }>(req);

  await runMetered(
    {
      userId: user.id,
      operation: 'analysis',
      idempotencyKey: typeof body.requestId === 'string' && body.requestId ? body.requestId : randomUUID(),
      metadata: { via: 'legacy/consume-generation' },
    },
    async () => ({ result: null })
  );

  const balance = await getBalance(user.id);
  const limit = balance.monthlyAllowance + balance.bonusCredits;
  res.status(200).json({
    success: true,
    used: Math.max(0, limit - balance.available),
    limit,
    remaining: balance.available,
  });
});
