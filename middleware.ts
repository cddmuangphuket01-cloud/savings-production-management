import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(req:NextRequest){const p=req.nextUrl.pathname;if(p.startsWith('/_next')||p==='/login'||p==='/setup'||p.startsWith('/api/auth')||p.startsWith('/favicon'))return NextResponse.next();if(p.startsWith('/api/'))return NextResponse.next();if(!req.cookies.get('session'))return NextResponse.redirect(new URL('/login',req.url));return NextResponse.next()}
export const config={matcher:['/((?!_next/static|_next/image).*)']};
