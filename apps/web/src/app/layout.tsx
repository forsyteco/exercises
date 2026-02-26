import type { Metadata } from 'next';
import './globals.css';
import '@forsyteco/product-ui/styles.css';

export const metadata: Metadata = {
  title: 'Forsyteco Exercises',
  description: 'Turborepo — Next.js + NestJS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
