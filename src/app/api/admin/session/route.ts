import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, isAdmin, login } from '@/server/admin';
import { clientId, fail, json, readJson, setCookie } from '@/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  return json({ authenticated: isAdmin(req) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await readJson<{ password?: string }>(req);
    const token = login(String(body?.password ?? ''), clientId(req));
    const res = json({ authenticated: true }, 201);
    setCookie(req, res, ADMIN_COOKIE, token);
    return res;
  } catch (e) { return fail(e); }
}

export async function DELETE() {
  const res = json({ authenticated: false });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
