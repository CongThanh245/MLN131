import type { NextRequest } from 'next/server';
import { QUESTION_BANK } from '@/game/questions';
import { requireAdmin } from '@/server/admin';
import { fail, json } from '@/server/http';
import { assertRoom } from '@/server/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Questions with answers: admin only, so players cannot read the answers before the game. */
export async function GET(req: NextRequest, ctx: RouteContext<'/api/admin/rooms/[code]/bank'>) {
  try {
    requireAdmin(req);
    await assertRoom((await ctx.params).code);
    return json({ questions: QUESTION_BANK });
  } catch (e) { return fail(e); }
}
