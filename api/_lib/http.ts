// Shared HTTP helpers for Vercel serverless functions.
// Files/folders prefixed with "_" inside /api are NOT exposed as routes by Vercel.

export class HttpError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;
  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  on?: (event: string, cb: (chunk?: unknown) => void) => void;
};

export type Res = {
  status: (code: number) => Res;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

export function header(req: Req, name: string): string | undefined {
  const v = req.headers[name.toLowerCase()];
  return Array.isArray(v) ? v[0] : v;
}

export function readJson<T = Record<string, unknown>>(req: Req): T {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      throw new HttpError(400, 'invalid_json', 'Request body must be valid JSON.');
    }
  }
  if (!body || typeof body !== 'object') return {} as T;
  return body as T;
}

export function queryParam(req: Req, name: string): string | undefined {
  const v = req.query?.[name];
  return Array.isArray(v) ? v[0] : v;
}

type Handler = (req: Req, res: Res) => Promise<void> | void;

/**
 * Wraps a handler with: method allow-list, no-store caching, and uniform JSON errors.
 * No wildcard CORS — the API is same-origin only.
 */
export function route(methods: string[], handler: Handler): Handler {
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    if (!req.method || !methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));
      res.status(405).json({ success: false, error: 'method_not_allowed', message: 'Method not allowed' });
      return;
    }
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ success: false, error: err.code, message: err.message, ...err.details });
        return;
      }
      console.error('[api] unhandled error', err);
      res.status(500).json({ success: false, error: 'internal_error', message: 'Something went wrong. Please try again.' });
    }
  };
}
