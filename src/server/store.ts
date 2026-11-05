import type { GameOptions } from '@/game/engine';
import { isRoomCode, newRoom, projectRoom, randomCode, refreshRoom, type RoomRecord, type Viewer } from '@/shared/room-core';
import { HttpError } from './http';
import { supabase } from './supabase';

/**
 * Rooms live in Supabase so any serverless instance can serve any request (Vercel).
 * - `cangua_rooms.body` holds the whole RoomRecord; `version` gives optimistic locking: a write only
 *   lands if nobody else wrote since we read, otherwise we reload and replay the change.
 * - `cangua_presence` holds each player's last poll, kept apart so 30 polling clients do not fight
 *   over the room row every second.
 */
const ROOMS = 'cangua_rooms';
const PRESENCE = 'cangua_presence';
export const ROOM_TTL_MS = 12 * 60 * 60 * 1000;
const PRESENCE_WRITE_MS = 5_000;
const RETRIES = 6;

interface Row { code: string; body: RoomRecord; version: number }
interface Loaded { room: RoomRecord; version: number; seen: Map<string, number> }

const normalize = (code: string): string => {
  const c = code.trim().toUpperCase();
  if (!isRoomCode(c)) throw new HttpError(404, 'Không tìm thấy phòng. Kiểm tra lại mã phòng.');
  return c;
};

async function load(code: string): Promise<Loaded> {
  const c = normalize(code);
  const [rows, presence] = await Promise.all([
    supabase<Row[]>(`${ROOMS}?code=eq.${c}&select=code,body,version&limit=1`),
    supabase<{ player_id: string; last_seen: number }[]>(`${PRESENCE}?code=eq.${c}&select=player_id,last_seen`)
  ]);
  const row = rows[0];
  if (!row || row.body.createdAt < Date.now() - ROOM_TTL_MS) throw new HttpError(404, 'Không tìm thấy phòng. Kiểm tra lại mã phòng.');
  const seen = new Map(presence.map((p) => [p.player_id, Number(p.last_seen)]));
  for (const p of row.body.players) p.lastSeen = Math.max(p.lastSeen, seen.get(p.id) ?? 0);
  return { room: row.body, version: Number(row.version), seen };
}

/** Writes the room only if it is still at `version`. Returns false when someone else wrote first. */
async function save(room: RoomRecord, version: number): Promise<boolean> {
  const rows = await supabase<{ version: number }[]>(`${ROOMS}?code=eq.${room.code}&version=eq.${version}&select=version`, {
    method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ body: room, version: version + 1 })
  });
  return rows.length > 0;
}

/** Records that `playerId` is online; skipped when we already recorded it a moment ago. */
async function touch(code: string, playerId: string, seen: Map<string, number>): Promise<void> {
  const now = Date.now();
  if (now - (seen.get(playerId) ?? 0) < PRESENCE_WRITE_MS) return;
  await supabase(`${PRESENCE}?on_conflict=code,player_id`, {
    method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ code, player_id: playerId, last_seen: now })
  }).catch(() => undefined); // presence is best effort
}

/**
 * Reads a room for display. `who` picks the viewer and may mark them online. Timeouts that are due
 * (auto-roll, unanswered question, auto-move) are applied and saved by whichever request sees them first.
 */
export async function readRoom(code: string, who: (room: RoomRecord) => Viewer) {
  for (let i = 0; i < RETRIES; i++) {
    const { room, version, seen } = await load(code);
    const viewer = who(room); // marks a polling player as seen before timeouts are judged
    if (refreshRoom(room) && !(await save(room, version))) continue; // someone else advanced it: read again
    if (viewer.role === 'team') await touch(room.code, viewer.playerId, seen);
    return projectRoom(room, viewer);
  }
  throw new HttpError(503, 'Phòng đang bận, vui lòng thử lại.');
}

/** Applies a change to a room atomically (retrying on concurrent writes) and returns what `fn` returns. */
export async function updateRoom<T>(code: string, fn: (room: RoomRecord) => { result: T; playerId?: string }): Promise<T> {
  for (let i = 0; i < RETRIES; i++) {
    const { room, version, seen } = await load(code);
    refreshRoom(room);
    const { result, playerId } = fn(room); // throws on an invalid command: nothing is saved
    if (!(await save(room, version))) continue;
    if (playerId) await touch(room.code, playerId, seen);
    return result;
  }
  throw new HttpError(503, 'Phòng đang bận, vui lòng thử lại.');
}

export async function createRoom(title: string, options: GameOptions): Promise<RoomRecord> {
  // Drop expired rooms now and then (presence rows go with them through the foreign key).
  await supabase(`${ROOMS}?created_at=lt.${new Date(Date.now() - ROOM_TTL_MS).toISOString()}`, { method: 'DELETE' }).catch(() => undefined);
  for (let i = 0; i < 5; i++) {
    const room = newRoom(randomCode(), title, options);
    try {
      await supabase(ROOMS, { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ code: room.code, body: room, version: 1 }) });
      return room;
    } catch (e) {
      if (e instanceof HttpError && e.status === 409) continue; // code taken, pick another
      throw e;
    }
  }
  throw new HttpError(503, 'Không tạo được mã phòng, vui lòng thử lại.');
}

export async function listRooms(): Promise<RoomRecord[]> {
  const since = new Date(Date.now() - ROOM_TTL_MS).toISOString();
  const rows = await supabase<{ body: RoomRecord }[]>(`${ROOMS}?created_at=gte.${since}&select=body&order=created_at.desc&limit=100`);
  return rows.map((r) => r.body);
}

export async function deleteRoom(code: string): Promise<void> {
  const rows = await supabase<{ code: string }[]>(`${ROOMS}?code=eq.${normalize(code)}&select=code`, { method: 'DELETE', headers: { Prefer: 'return=representation' } });
  if (!rows.length) throw new HttpError(404, 'Không tìm thấy phòng.');
}

/** Throws 404 when the room does not exist. */
export async function assertRoom(code: string): Promise<void> { await load(code); }
