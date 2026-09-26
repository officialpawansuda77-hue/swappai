// Lightweight, privacy-first analytics helper for SWAPP.AI
// Compatible with Vercel Web Analytics and custom event tracking

type AnalyticsEvent =
  | 'page_view'
  | 'template_view'
  | 'template_open_canvas'
  | 'carousel_export'
  | 'plan_selected'
  | 'checkout_completed'
  | 'admin_template_published';

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string | number | boolean>) {
  try {
    // 1. Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', { name: event, data: properties });
    }

    // 2. Safe local debug log in dev mode
    if (import.meta.env.DEV) {
      console.log(`[ANALYTICS] ${event}:`, properties || {});
    }
  } catch {
    // Non-blocking fail-safe
  }
}
