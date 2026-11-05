import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/server/admin';
import { fail, HttpError, json, readJson } from '@/server/http';
import { updateRoom } from '@/server/store';
import { projectRoom, runCommand, type RoomCommand, type Viewer } from '@/shared/room-core';

export const runtime = 'nodejs';

const HOST: Viewer = { role: 'host' };

export async function POST(req: NextRequest, ctx: RouteContext<'/api/admin/rooms/[code]/command'>) {
  try {
    requireAdmin(req);
    const body = await readJson<{ command?: RoomCommand }>(req);
    const command = body?.command;
    if (!command || typeof command.type !== 'string') throw new HttpError(400, 'Thiếu lệnh.');
    return json(await updateRoom((await ctx.params).code, (room) => {
      runCommand(room, HOST, command);
      return { result: projectRoom(room, HOST) };
    }));
  } catch (e) { return fail(e); }
}
