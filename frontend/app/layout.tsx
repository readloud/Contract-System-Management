import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Contract Management System',
  description: 'Enterprise Contract Management System with Legal Digital Signature',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}