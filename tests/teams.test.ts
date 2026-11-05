import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createGame, finishFor, isSafeCell, progressAt, ringCell, ringSizeFor, type TeamInput } from '../src/game/engine.ts';
import { QUESTION_BANK } from '../src/game/questions.ts';
import { armsOf, claimSlot, newRoom, projectRoom, runCommand, type RoomRecord } from '../src/shared/room-core.ts';

const HOST = { role: 'host' } as const;
const rng = () => 0.42;
const teams = (n: number): TeamInput[] => Array.from({ length: n }, (_, i) => ({ id: `t${i + 1}`, seat: i, members: [{ id: `m${i + 1}`, name: `P${i + 1}` }] }));

test('the ring and finish scale with the number of arms', () => {
  for (const arms of [2, 3, 4, 5, 6]) {
    const size = ringSizeFor(arms);
    assert.equal(size, arms * 5);
    assert.equal(finishFor(arms), size + 3);
    const starts = new Set<number>();
    for (let seat = 0; seat < arms; seat++) {
      const start = ringCell(seat, 1, arms)!;
      starts.add(start);
      assert.ok(isSafeCell(start));
      assert.equal(ringCell(seat, size + 1, arms), null);       // past the ring = home lane
      for (let p = 1; p <= size; p++) assert.equal(progressAt(seat, ringCell(seat, p, arms)!, arms), p);
    }
    assert.equal(starts.size, arms);
  }
});

test('a 5-arm game uses the 5-arm finish line and rejects a team without an arm', () => {
  const g = createGame(teams(5), QUESTION_BANK, 0, rng, { arms: 5 });
  assert.equal(g.arms, 5);
  assert.equal(g.finish, finishFor(5));
  assert.throws(() => createGame(teams(6), QUESTION_BANK, 0, rng, { arms: 5 }), /2 đến 5 đội/);
});

test('a new room has 5 teams by default and the admin can add and remove teams', () => {
  const room: RoomRecord = newRoom('ABCDE', 'Thử');
  assert.equal(armsOf(room), 5);
  assert.equal(projectRoom(room, HOST).teams.length, 5);

  runCommand(room, HOST, { type: 'add-team' });
  assert.equal(armsOf(room), 6);
  assert.throws(() => runCommand(room, HOST, { type: 'add-team' }), /Tối đa 6/);

  // Players in the removed (last) team move to the emptiest remaining team.
  const a = claimSlot(room, 'An', 5);
  claimSlot(room, 'Bình', 0);
  runCommand(room, HOST, { type: 'remove-team' });
  assert.equal(armsOf(room), 5);
  assert.ok(a.slot >= 1 && a.slot <= 4, `moved to slot ${a.slot}`);
  assert.throws(() => claimSlot(room, 'Chi', 5), /Đội không hợp lệ/);

  for (let i = 0; i < 3; i++) runCommand(room, HOST, { type: 'remove-team' });
  assert.equal(armsOf(room), 2);
  assert.throws(() => runCommand(room, HOST, { type: 'remove-team' }), /ít nhất 2/);
  assert.ok(room.players.every((p) => p.slot < 2));
});

test('starting a game uses the room team count as board arms; teams are fixed afterwards', () => {
  const room = newRoom('FGHJK', 'Thử');
  claimSlot(room, 'An', 0);
  claimSlot(room, 'Bình', 3);
  runCommand(room, HOST, { type: 'start' });
  assert.equal(room.game!.arms, 5);
  assert.equal(projectRoom(room, HOST).game!.arms, 5);
  assert.throws(() => runCommand(room, HOST, { type: 'add-team' }), /chưa bắt đầu/);
});
