// POST /api/credits/refund  { generationId, reason }  — ADMIN ONLY.
// Normal failures are refunded automatically inside runMetered(); exposing a
// user-facing refund would let users refund successful generations.
// Also supports { userId, delta, note } for manual bonus-credit adjustments.
import { route, readJson, HttpError } from '../_lib/http.js';
import { requireAdmin } from '../_lib/auth.js';
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js';

export default route(['POST'], async (req, res) => {
  const admin = await requireAdmin(req);
  const body = readJson<{ generationId?: string; reason?: string; userId?: string; delta?: number; note?: string }>(req);
  const supabase = getSupabaseAdmin();

  if (body.generationId) {
    const { data: gen } = await supabase.from('generations').select('*').eq('id', body.generationId).maybeSingle();
    if (!gen) throw new HttpError(404, 'not_found', 'Generation not found.');

    if (gen.status === 'reserved') {
      const { data, error } = await supabase.rpc('refund_generation', {
        p_generation_id: gen.id,
        p_error: `admin refund by ${admin.id}: ${body.reason || 'n/a'}`.slice(0, 500),
      });
      if (error) throw new HttpError(500, 'refund_failed', error.message);
      res.status(200).json({ success: true, ...data });
      return;
    }

    // Already finalized: grant the used credits back as bonus credits (audited).
    const { data, error } = await supabase.rpc('admin_adjust_credits', {
      p_user_id: gen.user_id,
      p_delta: gen.credits_used,
      p_note: `refund generation ${gen.id} by ${admin.id}: ${body.reason || 'n/a'}`.slice(0, 500),
    });
    if (error) throw new HttpError(500, 'refund_failed', error.message);
    res.status(200).json({ success: true, ...data });
    return;
  }

  if (body.userId && Number.isInteger(body.delta)) {
    const { data, error } = await supabase.rpc('admin_adjust_credits', {
      p_user_id: body.userId,
      p_delta: body.delta,
      p_note: `admin ${admin.id}: ${body.note || 'manual adjustment'}`.slice(0, 500),
    });
    if (error) throw new HttpError(500, 'adjust_failed', error.message);
    res.status(200).json({ success: true, ...data });
    return;
  }

  throw new HttpError(400, 'invalid_request', 'Provide generationId, or userId + integer delta.');
});
