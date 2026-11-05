/** Server-side only: talks to Supabase PostgREST with the secret key. Never import from a client component. */
import { HttpError } from './http';

function config(): { base: string; key: string } {
  const base = (process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim())?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!base || !key) throw new HttpError(500, 'Máy chủ thiếu SUPABASE_URL (hoặc NEXT_PUBLIC_SUPABASE_URL) hoặc SUPABASE_SECRET_KEY.');
  if (!/^https:\/\/[^/?#@]+$/.test(base)) throw new HttpError(500, 'SUPABASE_URL phải là URL HTTPS gốc của project Supabase.');
  return { base, key };
}

/** Calls `/rest/v1/<resource>`; returns the parsed JSON body (undefined when empty). */
export async function supabase<T>(resource: string, init: RequestInit = {}): Promise<T> {
  const { base, key } = config();
  const headers = new Headers(init.headers);
  headers.set('apikey', key);
  // Legacy JWT keys (service_role) also need the Authorization header; new sb_secret_ keys must not send it.
  if (!key.startsWith('sb_secret_')) headers.set('Authorization', `Bearer ${key}`);
  headers.set('Content-Type', 'application/json');
  let res: Response;
  try {
    res = await fetch(`${base}/rest/v1/${resource}`, { ...init, headers, cache: 'no-store', signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new HttpError(503, 'Không kết nối được cơ sở dữ liệu. Vui lòng thử lại.');
  }
  if (!res.ok) {
    const details = await res.json().catch(() => ({})) as { code?: string };
    if (res.status === 409 || details.code === '23505') throw new HttpError(409, 'Dữ liệu bị trùng.');
    const hint = res.status === 401 || res.status === 403 ? 'Kiểm tra SUPABASE_SECRET_KEY.'
      : details.code === 'PGRST205' || details.code === '42P01' ? 'Hãy chạy supabase/migrations/001_cangua_rooms.sql trong Supabase SQL Editor.'
      : 'Vui lòng thử lại.';
    // Never pass the response body on: it can contain room data.
    throw new HttpError(500, `Lỗi cơ sở dữ liệu (${res.status}). ${hint}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
