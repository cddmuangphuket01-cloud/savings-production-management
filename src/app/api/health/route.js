import { getDb } from '@/lib/db';
export async function GET() {
  try { await getDb().query('SELECT 1'); return Response.json({ ok: true, database: 'connected' }); }
  catch (e) { return Response.json({ ok: false, error: e.message }, { status: 500 }); }
}
