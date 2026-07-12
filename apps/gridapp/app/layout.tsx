import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Saathi - My Voice',
  description: 'Dynamic Ai grid.',
  manifest: '/manifest.json',
};
export const viewport: Viewport = {
  themeColor: '#5b4fe8',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-[1200px] px-6 py-6">{children}</div>
      </body>
    </html>
  );
}
