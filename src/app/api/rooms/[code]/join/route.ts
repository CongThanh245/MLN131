import type { NextRequest } from 'next/server';
import { fail, json, readJson, setCookie } from '@/server/http';
import { updateRoom } from '@/server/store';
import { claimSlot, playerViewer, projectRoom } from '@/shared/room-core';

export const runtime = 'nodejs';

export async function POST(req: NextRequest, ctx: RouteContext<'/api/rooms/[code]/join'>) {
  try {
    const code = (await ctx.params).code.toUpperCase();
    const body = await readJson<{ name?: string; slot?: number | null }>(req);
    const token = req.cookies.get(`vnr_team_${code}`)?.value;
    const slot = body?.slot === undefined || body.slot === null ? undefined : Number(body.slot);
    const { view, playerToken } = await updateRoom(code, (room) => {
      const existing = token ? room.players.find((x) => x.token === token) : undefined;
      const player = claimSlot(room, String(body?.name ?? ''), slot, existing);
      return { result: { view: projectRoom(room, playerViewer(room, player.token)), playerToken: player.token }, playerId: player.id };
    });
    const res = json(view);
    setCookie(req, res, `vnr_team_${view.code}`, playerToken);
    return res;
  } catch (e) { return fail(e); }
}
