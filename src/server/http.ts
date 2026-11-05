import { NextResponse, type NextRequest } from 'next/server';

/** An error with an HTTP status; anything else thrown is treated as a 400 with its message (game rule violations). */
export class HttpError extends Error {
  constructor(readonly status: number, message: string) { super(message); }
}

export const SESSION_MS = 12 * 60 * 60 * 1000;

export function json(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

/** The web client expects every failure as `{ error: string }` in Vietnamese. */
export function fail(error: unknown): NextResponse {
  if (error instanceof HttpError) return json({ error: error.message }, error.status);
  if (error instanceof Error && !(error instanceof TypeError) && !(error instanceof SyntaxError)) return json({ error: error.message }, 400);
  console.error(error);
  return json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại.' }, 500);
}

/** Writes need a JSON body; browsers cannot send that cross-site without a CORS preflight. */
export async function readJson<T>(req: NextRequest): Promise<T> {
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) throw new HttpError(400, 'Yêu cầu phải ở dạng JSON.');
  try { return (await req.json()) as T; } catch { throw new HttpError(400, 'Dữ liệu gửi lên không hợp lệ.'); }
}

export function setCookie(req: NextRequest, res: NextResponse, name: string, value: string, maxAgeMs = SESSION_MS): void {
  const secure = (req.headers.get('x-forwarded-proto') ?? req.nextUrl.protocol.replace(':', '')) === 'https';
  res.cookies.set(name, value, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: Math.floor(maxAgeMs / 1000), secure });
}

export function clientId(req: NextRequest): string {
  return (req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown').split(',')[0].trim();
}
