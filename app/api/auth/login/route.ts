import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
export async function POST(req:Request){try{const {username,password}=await req.json();const r=await db.query('SELECT id,username,password_hash,full_name,role,active FROM users WHERE username=$1',[username]);if(!r.rowCount||!r.rows[0].active||!(await bcrypt.compare(password,r.rows[0].password_hash)))return NextResponse.json({error:'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'},{status:401});const u=r.rows[0];await createSession({id:u.id,username:u.username,role:u.role,full_name:u.full_name});return NextResponse.json({ok:true,user:{username:u.username,full_name:u.full_name,role:u.role}})}catch{return NextResponse.json({error:'เข้าสู่ระบบไม่สำเร็จ'},{status:500})}}
