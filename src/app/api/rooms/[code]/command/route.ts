import type { NextRequest } from 'next/server';
import { fail, HttpError, json, readJson } from '@/server/http';
import { updateRoom } from '@/server/store';
import { playerViewer, projectRoom, runCommand, type RoomCommand } from '@/shared/room-core';

export const runtime = 'nodejs';

/** Player commands: leave a team and play turns. No admin powers here. */
export async function POST(req: NextRequest, ctx: RouteContext<'/api/rooms/[code]/command'>) {
  try {
    const code = (await ctx.params).code.toUpperCase();
    const body = await readJson<{ command?: RoomCommand }>(req);
    const command = body?.command;
    if (!command || typeof command.type !== 'string') throw new HttpError(400, 'Thiếu lệnh.');
    const token = req.cookies.get(`vnr_team_${code}`)?.value;
    return json(await updateRoom(code, (room) => {
      const viewer = playerViewer(room, token);
      if (viewer.role === 'host') throw new HttpError(403, 'Không có quyền.');
      runCommand(room, viewer, command);
      return { result: projectRoom(room, viewer), playerId: viewer.role === 'team' ? viewer.playerId : undefined };
    }));
  } catch (e) { return fail(e); }
}
