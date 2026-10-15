// Ambient TypeScript definitions for Supabase Edge Functions in Deno environment

declare namespace Deno {
  export const env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
  };
  export function serve(
    handler: (req: Request) => Promise<Response> | Response,
    options?: { port?: number; hostname?: string; onListen?: (params: { port: number; hostname: string }) => void }
  ): void;
}

declare module 'https://*' {
  export const serve: (handler: (req: Request) => Promise<Response> | Response) => void;
  export const createClient: (url: string, key: string, options?: any) => any;
  const content: any;
  export default content;
}

declare module 'jsr:*' {
  const content: any;
  export default content;
}
