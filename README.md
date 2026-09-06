# ระบบบริหารจัดการเงินออมทรัพย์เพื่อการผลิต

ระบบเว็บสำหรับงานเงินออมทรัพย์เพื่อการผลิต ใช้ **Next.js + TypeScript + Tailwind CSS + Neon PostgreSQL**

## ฟังก์ชันที่มี
- Dashboard ภาพรวมสมาชิกและยอดเงิน
- Login / Logout และสิทธิ์ผู้ดูแล
- ตั้งค่าผู้ดูแลระบบครั้งแรก
- เพิ่ม / แก้ไข / ลบสมาชิก
- ระงับสมาชิกแทนการลบเมื่อมีประวัติธุรกรรม
- ฝากเงิน / ถอนเงิน / ดอกเบี้ย / ปรับปรุงยอด
- ป้องกันถอนเกินยอดคงเหลือด้วยฐานข้อมูล transaction + row lock
- ออกใบเสร็จและสั่งพิมพ์
- รายงานสมาชิกและรายงานธุรกรรม
- Export Excel / PDF / Print
- Responsive สำหรับโทรศัพท์และคอมพิวเตอร์

## ตั้งค่า Environment
สร้าง `.env.local` จาก `.env.example`

```env
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
AUTH_SECRET=YOUR_LONG_RANDOM_SECRET
```

> ห้าม commit `.env.local` หรือ connection string จริงขึ้น GitHub

## เริ่มใช้งาน
```bash
npm install
npm run dev
```

เปิด `http://localhost:3000/setup` **ครั้งแรกเท่านั้น** เพื่อสร้างผู้ดูแลระบบ จากนั้นเข้าสู่ระบบที่ `/login`
