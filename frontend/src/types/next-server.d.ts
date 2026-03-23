declare module 'next/server' {
  export interface NextRequest extends Request {
    cookies: {
      get: (name: string) => { value: string } | undefined;
    };
  }

  export class NextResponse extends Response {
    static json(body: unknown, init?: ResponseInit): NextResponse;
    cookies: {
      set: (name: string, value: string, options?: Record<string, unknown>) => void;
      delete: (name: string) => void;
    };
  }
}
