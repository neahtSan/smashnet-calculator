import './globals.css';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from './lib/AntdRegistry';
import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

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
            <Analytics />
            <SpeedInsights />
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
