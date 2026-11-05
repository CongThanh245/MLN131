import type { NextRequest } from 'next/server';
import { fail, json } from '@/server/http';
import { readRoom } from '@/server/store';
import { playerViewer } from '@/shared/room-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Player / spectator view. Identity comes from the per-room player cookie only. */
export async function GET(req: NextRequest, ctx: RouteContext<'/api/rooms/[code]'>) {
  try {
    const code = (await ctx.params).code.toUpperCase();
    const token = req.cookies.get(`vnr_team_${code}`)?.value;
    return json(await readRoom(code, (room) => playerViewer(room, token)));
  } catch (e) { return fail(e); }
}
