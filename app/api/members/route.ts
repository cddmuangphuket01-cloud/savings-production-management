import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(){
  const {rows}=await db.query(`SELECT m.*, COALESCE(a.balance,0)::numeric AS balance FROM members m LEFT JOIN accounts a ON a.member_id=m.id ORDER BY m.id DESC`); return NextResponse.json(rows);
}
export async function POST(req:Request){
  try{const b=await req.json(); const c=await db.query(`INSERT INTO members(member_no,national_id,first_name,last_name,phone,address,joined_at) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[b.member_no,b.national_id||null,b.first_name,b.last_name,b.phone||null,b.address||null,b.joined_at||new Date().toISOString().slice(0,10)]); await db.query(`INSERT INTO accounts(member_id) VALUES($1)`,[c.rows[0].id]); return NextResponse.json(c.rows[0],{status:201});}catch(e){return NextResponse.json({error:'ไม่สามารถเพิ่มสมาชิกได้'},{status:400})}
}
