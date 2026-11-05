import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/server/admin';
import { fail, json } from '@/server/http';
import { deleteRoom, readRoom } from '@/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, ctx: RouteContext<'/api/admin/rooms/[code]'>) {
  try {
    requireAdmin(req);
    return json(await readRoom((await ctx.params).code, () => ({ role: 'host' })));
  } catch (e) { return fail(e); }
}

export async function DELETE(req: NextRequest, ctx: RouteContext<'/api/admin/rooms/[code]'>) {
  try {
    requireAdmin(req);
    await deleteRoom((await ctx.params).code);
    return json({ ok: true });
  } catch (e) { return fail(e); }
}
