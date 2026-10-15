// POST /api/credits/check  { operation }
// Shows expected cost and whether the user can afford it. Spends nothing.
import { route, readJson, HttpError } from '../_lib/http.js';
import { requireUser } from '../_lib/auth.js';
import { getBalance } from '../_lib/credits.js';
import { getCreditCost } from '../_lib/config.js';
import { CONFIRM_THRESHOLD_CREDITS, DEFAULT_CREDIT_COSTS, type AiOperation } from '../../src/shared/plans.js';

export default route(['POST'], async (req, res) => {
  const user = await requireUser(req);
  const { operation, quantity } = readJson<{ operation?: string; quantity?: number }>(req);

  if (!operation || !(operation in DEFAULT_CREDIT_COSTS)) {
    throw new HttpError(400, 'invalid_operation', 'Unknown AI operation.');
  }
  const qty = Math.min(Math.max(1, Math.floor(Number(quantity) || 1)), 50);

  const [unitCost, balance] = await Promise.all([getCreditCost(operation as AiOperation), getBalance(user.id)]);
  const cost = unitCost * qty;

  res.status(200).json({
    success: true,
    operation,
    unitCost,
    cost,
    available: balance.available,
    sufficient: balance.available >= cost,
    requiresConfirmation: cost >= CONFIRM_THRESHOLD_CREDITS,
  });
});
