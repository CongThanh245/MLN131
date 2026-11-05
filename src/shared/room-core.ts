import { randomBytes, randomInt } from 'node:crypto';
import {
  applyAction, createGame, DEFAULT_ARMS, DEFAULT_TIME_LIMIT_MS, endGame, homeCount, MAX_ARMS, MAX_MEMBERS, MIN_ARMS, pauseGame, resumeGame, tick, type GameOptions
} from '../game/engine.ts';
import { QUESTION_BANK, questionById } from '../game/questions.ts';
import { COLOR_NAMES, TEAM_COLORS, type GameAction, type GameState, type SkillCard, type TeamColor } from '../game/types.ts';

/** A person at a laptop. `slot` (0 .. arms-1) is their team: fixed seat and colour on the board. */
export interface LobbyPlayer { id: string; name: string; slot: number; token: string; lastSeen: number }

export interface RoomRecord {
  code: string;
  title: string;
  createdAt: number;
  players: LobbyPlayer[];
  status: 'lobby' | 'playing' | 'finished';
  game: GameState | null;
  options: GameOptions;
  revision: number;
}

export type Viewer = { role: 'host' } | { role: 'team'; teamId: string; playerId: string } | { role: 'spectator' };

export type RoomCommand =
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'end' }
  | { type: 'rematch' }
  | { type: 'remove-player'; playerId: string }
  | { type: 'add-team' }
  | { type: 'remove-team' }
  | { type: 'leave' }
  | { type: 'game'; action: GameAction };

/** Team slots a new room starts with; the admin can add or remove teams in the lobby (MIN_ARMS..MAX_ARMS). */
export const DEFAULT_TEAMS = 5;
const rng = (): number => randomInt(0, 2 ** 32) / 2 ** 32;
const token = (): string => randomBytes(18).toString('base64url');
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 5;
/** Player not heard from for this long counts as disconnected; the game then plays their turn after AUTOPLAY_MS. */
export const OFFLINE_MS = 20_000;
const AUTOPLAY_MS = 4_000;
const bump = (room: RoomRecord): void => { room.revision += 1; };

export const teamIdOf = (slot: number): string => `t${slot + 1}-${TEAM_COLORS[slot]}`;
export const teamNameOf = (slot: number): string => `Đội ${COLOR_NAMES[TEAM_COLORS[slot]]}`;
/** Team slots (= board arms) of a room. Rooms made before this option existed had six. */
export const armsOf = (room: RoomRecord): number => room.game?.arms ?? room.options.arms ?? DEFAULT_ARMS;

export const randomCode = (): string => Array.from({ length: CODE_LENGTH }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
export const isRoomCode = (code: string): boolean => new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`).test(code);

export function newRoom(code: string, title: string, options: GameOptions = {}): RoomRecord {
  return {
    code, title: title.trim().slice(0, 60) || 'Cá Ngựa Cách Mạng', createdAt: Date.now(),
    players: [], status: 'lobby', game: null, options: { ...options, arms: options.arms ?? DEFAULT_TEAMS }, revision: 1
  };
}

/** Applies timeouts and plays for a disconnected acting player. Returns true when the room changed. */
export function refreshRoom(room: RoomRecord): boolean {
  const before = room.revision;
  if (room.game) {
    const now = Date.now();
    // A disconnected acting player must not stall everybody for a whole turn: play for them after a short grace period.
    const g = room.game;
    const acting = room.players.find((p) => p.id === g.actingMemberId);
    if (acting && !g.paused && g.deadline !== null && g.phase !== 'finished' && now - acting.lastSeen > OFFLINE_MS && g.deadline > now + AUTOPLAY_MS) {
      room.game = { ...g, deadline: now + AUTOPLAY_MS };
    }
    const next = tick(room.game, now, rng, QUESTION_BANK);
    if (next !== room.game) { room.game = next; bump(room); }
    if (room.game.phase === 'finished' && room.status !== 'finished') { room.status = 'finished'; bump(room); }
  }
  return room.revision !== before;
}

/**
 * Joins team `slot` (0 .. arms-1), or moves to it when the player already holds a seat. Each person gets
 * their own horse; a team holds up to 6 people. Without a slot the emptiest team is chosen.
 */
export function claimSlot(room: RoomRecord, name: string, slot: number | undefined, existing?: LobbyPlayer): LobbyPlayer {
  if (room.status !== 'lobby') throw new Error('Phòng đã bắt đầu, không thể đổi hoặc vào thêm đội.');
  const clean = name.trim().replace(/\s+/g, ' ').slice(0, 24);
  if (clean.length < 2) throw new Error('Tên người chơi cần ít nhất 2 ký tự.');
  const size = (i: number) => room.players.filter((p) => p.slot === i && p !== existing).length;
  const arms = armsOf(room);
  const pick = slot ?? Array.from({ length: arms }, (_, i) => i).sort((a, b) => size(a) - size(b))[0];
  if (!Number.isInteger(pick) || pick < 0 || pick >= arms) throw new Error('Đội không hợp lệ.');
  if (size(pick) >= MAX_MEMBERS) throw new Error(`${teamNameOf(pick)} đã đủ ${MAX_MEMBERS} người.`);
  if (room.players.some((p) => p !== existing && p.name.toLocaleLowerCase('vi') === clean.toLocaleLowerCase('vi'))) throw new Error('Tên này đã có người dùng.');
  if (existing) { Object.assign(existing, { name: clean, slot: pick }); bump(room); return existing; }
  const player: LobbyPlayer = { id: `p${randomBytes(4).toString('hex')}`, name: clean, slot: pick, token: token(), lastSeen: Date.now() };
  room.players.push(player);
  bump(room);
  return player;
}

export function leaveSlot(room: RoomRecord, existing: LobbyPlayer): void {
  if (room.status !== 'lobby') throw new Error('Không thể rời đội khi ván đấu đã bắt đầu.');
  room.players = room.players.filter((p) => p !== existing);
  bump(room);
}

/** Player-facing identity from the player cookie; admins get `{ role: 'host' }` from the admin API instead. */
export function playerViewer(room: RoomRecord, playerToken?: string): Viewer {
  const p = playerToken ? room.players.find((x) => x.token === playerToken) : undefined;
  if (p) { p.lastSeen = Date.now(); return { role: 'team', teamId: teamIdOf(p.slot), playerId: p.id }; }
  return { role: 'spectator' };
}

function teamInputs(room: RoomRecord) {
  return TEAM_COLORS.slice(0, armsOf(room)).map((_, slot) => ({
    id: teamIdOf(slot), seat: slot,
    members: room.players.filter((p) => p.slot === slot).map((p) => ({ id: p.id, name: p.name }))
  })).filter((t) => t.members.length > 0);
}

export function runCommand(room: RoomRecord, viewer: Viewer, command: RoomCommand): void {
  const now = Date.now();
  if (command.type === 'leave') {
    if (viewer.role !== 'team') throw new Error('Bạn chưa vào đội nào.');
    const me = room.players.find((x) => x.id === viewer.playerId);
    if (me) leaveSlot(room, me);
  } else if (command.type === 'game') {
    if (viewer.role !== 'team') throw new Error('Chỉ người chơi mới thao tác được.');
    if (!room.game) throw new Error('Ván đấu chưa bắt đầu.');
    room.game = applyAction(room.game, viewer.playerId, command.action, now, rng, QUESTION_BANK);
  } else {
    if (viewer.role !== 'host') throw new Error('Chỉ người điều khiển phòng mới dùng được lệnh này.');
    switch (command.type) {
      case 'start':
        if (room.status !== 'lobby') throw new Error('Ván đấu đã bắt đầu.');
        room.game = createGame(teamInputs(room), QUESTION_BANK, now, rng, { ...room.options, arms: armsOf(room) });
        room.status = 'playing';
        break;
      case 'pause': if (room.game) room.game = pauseGame(room.game, now); break;
      case 'resume': if (room.game) room.game = resumeGame(room.game, now); break;
      case 'end': if (room.game) room.game = endGame(room.game, now); break;
      case 'rematch':
        if (room.status !== 'finished') throw new Error('Chỉ chơi lại được khi ván đã kết thúc.');
        room.game = createGame(teamInputs(room), QUESTION_BANK, now, rng, { ...room.options, arms: armsOf(room) });
        room.status = 'playing';
        break;
      case 'remove-player':
        if (room.status !== 'lobby') throw new Error('Chỉ xóa người chơi được khi chưa bắt đầu.');
        room.players = room.players.filter((p) => p.id !== command.playerId);
        break;
      case 'add-team': {
        if (room.status !== 'lobby') throw new Error('Chỉ thêm đội được khi chưa bắt đầu.');
        const arms = armsOf(room);
        if (arms >= MAX_ARMS) throw new Error(`Tối đa ${MAX_ARMS} đội.`);
        room.options = { ...room.options, arms: arms + 1 };
        break;
      }
      case 'remove-team': {
        if (room.status !== 'lobby') throw new Error('Chỉ xóa đội được khi chưa bắt đầu.');
        const arms = armsOf(room);
        if (arms <= MIN_ARMS) throw new Error(`Cần ít nhất ${MIN_ARMS} đội.`);
        const last = arms - 1;
        const moving = room.players.filter((p) => p.slot === last);
        const free = room.players.filter((p) => p.slot !== last).length;
        if (moving.length + free > last * MAX_MEMBERS) throw new Error(`Không đủ chỗ để chuyển người chơi của ${teamNameOf(last)} sang đội khác.`);
        // Members of the removed (last) team move to the emptiest remaining teams.
        for (const p of moving) {
          const size = (i: number) => room.players.filter((x) => x.slot === i && x !== p).length;
          p.slot = Array.from({ length: last }, (_, i) => i).sort((a, b) => size(a) - size(b))[0];
        }
        room.options = { ...room.options, arms: last };
        break;
      }
      default: throw new Error('Lệnh không hợp lệ.');
    }
  }
  if (room.game?.phase === 'finished') room.status = 'finished';
  bump(room);
}

/** What a client may see. Never includes the correct answer or other teams' hands. */
export function projectRoom(room: RoomRecord, viewer: Viewer) {
  const g = room.game;
  const myTeam = viewer.role === 'team' ? viewer.teamId : null;
  const now = Date.now();
  return {
    code: room.code, title: room.title, status: room.status, revision: room.revision, serverNow: now,
    settings: {
      winHome: room.options.winHome ?? 2, exitRolls: room.options.exitRolls ?? [1, 6],
      horses: room.options.horses ?? 2, teams: armsOf(room), minTeams: MIN_ARMS, maxTeams: MAX_ARMS, timeLimitMin: Math.round((room.options.timeLimitMs ?? DEFAULT_TIME_LIMIT_MS) / 60_000)
    },
    viewer: viewer.role === 'team' ? { role: 'team' as const, teamId: viewer.teamId, playerId: viewer.playerId } : { role: viewer.role },
    teams: TEAM_COLORS.slice(0, armsOf(room)).map((color: TeamColor, slot) => ({
      id: teamIdOf(slot), slot, color, name: teamNameOf(slot),
      members: room.players.filter((p) => p.slot === slot).map((p) => ({ id: p.id, name: p.name, online: now - p.lastSeen < 15_000 }))
    })),
    game: g && {
      phase: g.phase, arms: g.arms, deadline: g.deadline, paused: g.paused, pausedRemaining: g.pausedRemaining, finish: g.finish,
      order: g.order, turnTeamId: g.turnTeamId, actingMemberId: g.actingMemberId, turnNumber: g.turnNumber, dice: g.dice,
      skillUsed: g.skillUsed, endsAt: g.endsAt, timeLeft: g.pausedLeft, timeLimitMs: g.timeLimitMs, pending: g.pending && { options: g.pending.options, outcome: g.pending.outcome }, winHome: g.winHome, exitRolls: g.exitRolls, streak: g.streak,
      deckCount: g.skillDeck.length, skillLog: g.skillLog.slice(-12),
      question: g.question && {
        id: g.question.id, text: g.question.text, options: g.question.options, removed: g.question.removed,
        hint: g.question.hintShown ? hintFor(g.question.id) : null
      },
      resolution: g.resolution, events: g.events.slice(-30), winnerId: g.winnerId, ranking: g.ranking, endedBy: g.endedBy,
      players: Object.fromEntries(Object.values(g.players).map((p) => [p.teamId, {
        seat: p.seat, members: p.members, horses: p.horses, handCount: p.hand.length, stunned: p.stunned, boost: p.boost,
        doubleDice: p.doubleDice, shield: p.shield, correct: p.correct, answered: p.answered,
        home: homeCount(p, g.finish), lead: Math.max(0, ...p.horses.map((h) => h.progress))
      }]))
    },
    hand: (myTeam && g?.players[myTeam]?.hand ? g.players[myTeam].hand : []) as SkillCard[]
  };
}

function hintFor(id: string): string { return questionById.get(id)?.hint ?? ''; }
