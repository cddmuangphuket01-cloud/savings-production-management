import './globals.css';
import { ReactNode } from 'react';

export const metadata = { title: 'เงินออมทรัพย์เพื่อการผลิต', description: 'ระบบบริหารจัดการเงินออมทรัพย์เพื่อการผลิต' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="th"><body>{children}</body></html>;
}
