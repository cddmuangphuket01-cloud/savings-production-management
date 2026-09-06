import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(){
  try{
    const members=(await db.query("SELECT COUNT(*)::int AS count FROM members WHERE status='active'")).rows[0].count;
    const totals=(await db.query("SELECT COALESCE(SUM(CASE WHEN transaction_type IN ('deposit','interest') THEN amount WHEN transaction_type='withdrawal' THEN -amount ELSE 0 END),0)::numeric AS balance, COALESCE(SUM(CASE WHEN transaction_type='deposit' THEN amount ELSE 0 END),0)::numeric AS deposits, COALESCE(SUM(CASE WHEN transaction_type='withdrawal' THEN amount ELSE 0 END),0)::numeric AS withdrawals FROM transactions")).rows[0];
    return NextResponse.json({members,balance:Number(totals.balance),deposits:Number(totals.deposits),withdrawals:Number(totals.withdrawals)});
  }catch(e){return NextResponse.json({error:'ไม่สามารถอ่านข้อมูล Dashboard ได้'},{status:500})}
}
