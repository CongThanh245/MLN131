import { createHmac, timingSafeEqual } from 'node:crypto';
import type { NextRequest } from 'next/server';
import { HttpError, SESSION_MS } from './http';

export const ADMIN_COOKIE = 'vnr_admin';

/**
 * Single shared admin password (ADMIN_PASSWORD). Sessions are stateless HMAC tokens in an httpOnly
 * cookie, keyed by the password itself so every serverless instance accepts them and changing the
 * password logs everybody out.
 */
function password(): string {
  const p = process.env.ADMIN_PASSWORD?.trim();
  if (!p || p.length < 6) throw new HttpError(503, 'Máy chủ chưa đặt ADMIN_PASSWORD (ít nhất 6 ký tự).');
  return p;
}

const sign = (expires: number, secret: string): string =>
  `${expires}.${createHmac('sha256', `vnr-admin-session:${secret}`).update(String(expires)).digest('base64url')}`;

// Best effort only: each serverless instance keeps its own counters.
const attempts = new Map<string, { n: number; reset: number }>();

export function login(given: string, client: string): string {
  const real = password();
  const now = Date.now();
  const slot = attempts.get(client);
  if (slot && slot.reset > now && slot.n >= 8) throw new HttpError(429, 'Nhập sai quá nhiều lần. Thử lại sau vài phút.');
  const a = createHmac('sha256', 'cmp').update(given).digest();
  const b = createHmac('sha256', 'cmp').update(real).digest();
  if (!timingSafeEqual(a, b)) {
    attempts.set(client, { n: slot && slot.reset > now ? slot.n + 1 : 1, reset: slot && slot.reset > now ? slot.reset : now + 5 * 60_000 });
    throw new HttpError(401, 'Sai mật khẩu quản trị.');
  }
  attempts.delete(client);
  return sign(now + SESSION_MS, real);
}

export function isAdmin(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const real = process.env.ADMIN_PASSWORD?.trim();
  if (!token || !real || real.length < 6) return false;
  const expires = Number(token.split('.')[0]);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const want = Buffer.from(sign(expires, real));
  const got = Buffer.from(token);
  return want.length === got.length && timingSafeEqual(want, got);
}

export function requireAdmin(req: NextRequest): void {
  if (!isAdmin(req)) throw new HttpError(401, 'Cần đăng nhập quản trị.');
}
