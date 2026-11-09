import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cá Ngựa Gia Đình · MLN131',
  description: 'Trò chơi cá ngựa nhiều đội ôn tập MLN131 Chương 7: Xây dựng gia đình Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội.'
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
