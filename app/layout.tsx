import './globals.css';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from './lib/AntdRegistry';
import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: 'Smashnet Calculator',
  description: 'Badminton matchmaking web app'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ConfigProvider>
            {children}
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
