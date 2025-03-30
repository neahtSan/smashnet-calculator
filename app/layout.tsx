import './globals.css';
import { Inter } from 'next/font/google';
import { ConfigProvider } from 'antd';
import StyledComponentsRegistry from './lib/AntdRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Smashnet Calculator',
  description: 'Badminton matchmaking web app',
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
