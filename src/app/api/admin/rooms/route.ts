import type { NextRequest } from 'next/server';
import type { GameOptions } from '@/game/engine';
import { requireAdmin } from '@/server/admin';
import { fail, json, readJson } from '@/server/http';
import { createRoom, listRooms } from '@/server/store';
import { armsOf, refreshRoom } from '@/shared/room-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const rooms = await listRooms();
    for (const r of rooms) refreshRoom(r); // show finished-by-time rooms correctly (not saved here)
    return json({
      rooms: rooms.map((r) => ({
        code: r.code, title: r.title, status: r.status, createdAt: r.createdAt,
        players: r.players.length, teams: new Set(r.players.map((p) => p.slot)).size, slots: armsOf(r),
        turn: r.game?.turnNumber ?? 0, winHome: r.options.winHome ?? 2, horses: r.options.horses ?? 2
      }))
    });
  } catch (e) { return fail(e); }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await readJson<{ title?: string; questionSeconds?: number; winHome?: number; exitRule?: string; horses?: number; timeLimitMin?: number; teams?: number }>(req);
    const options: GameOptions = {};
    const q = Number(body?.questionSeconds), w = Number(body?.winHome), t = Number(body?.timeLimitMin), n = Number(body?.teams);
    if (Number.isFinite(q) && q >= 10 && q <= 90) options.questionMs = q * 1000;
    if (Number.isInteger(w) && w >= 1 && w <= 3) options.winHome = w;
    options.exitRolls = body?.exitRule === 'six' ? [6] : [1, 6];
    options.horses = Number(body?.horses) === 3 ? 3 : 2;
    if (Number.isFinite(t) && t >= 5 && t <= 30) options.timeLimitMs = t * 60_000;
    if (Number.isInteger(n) && n >= 2 && n <= 6) options.arms = n;
    const room = await createRoom(String(body?.title ?? ''), options);
    return json({ code: room.code }, 201);
  } catch (e) { return fail(e); }
}
