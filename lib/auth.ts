import {SignJWT,jwtVerify} from 'jose';import {cookies} from 'next/headers';import {NextResponse} from 'next/server';
const secret=new TextEncoder().encode(process.env.AUTH_SECRET||'change-this-secret-in-production');
export async function createSession(user:{id:number,username:string,role:string,full_name:string}){const token=await new SignJWT(user).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret);(await cookies()).set('session',token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:28800,path:'/'});}
export async function getSession(){try{const token=(await cookies()).get('session')?.value;if(!token)return null;return(await jwtVerify(token,secret)).payload as any}catch{return null}}
export async function requireSession(){const s=await getSession();if(!s)throw new Error('UNAUTHORIZED');return s}
export async function clearSession(){(await cookies()).delete('session')}
export function unauthorized(){return NextResponse.json({error:'กรุณาเข้าสู่ระบบ'},{status:401})}
