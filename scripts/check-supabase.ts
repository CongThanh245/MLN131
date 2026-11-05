// Checks that the Supabase env vars work and the game tables exist: npm run supabase:check
export {};
const base = (process.env.SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim())?.replace(/\/$/, '');
const key = process.env.SUPABASE_SECRET_KEY?.trim() || process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!base || !key) {
  console.error('Thiếu SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SECRET_KEY trong .env.local.');
  process.exit(1);
}
const headers: Record<string, string> = { apikey: key };
if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;
let ok = true;
for (const table of ['cangua_rooms', 'cangua_presence']) {
  const res = await fetch(`${base}/rest/v1/${table}?select=*&limit=1`, { headers });
  const body = await res.json().catch(() => ({})) as { code?: string };
  if (res.ok) console.log(`✔ ${table}: sẵn sàng`);
  else {
    ok = false;
    const hint = body.code === 'PGRST205' ? 'chưa có bảng, hãy chạy supabase/migrations/001_cangua_rooms.sql' : res.status === 401 ? 'key sai' : `lỗi ${res.status}`;
    console.error(`✘ ${table}: ${hint}`);
  }
}
if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.trim().length < 6) { ok = false; console.error('✘ ADMIN_PASSWORD chưa đặt hoặc ngắn hơn 6 ký tự.'); }
else console.log('✔ ADMIN_PASSWORD: đã đặt');
process.exit(ok ? 0 : 1);
