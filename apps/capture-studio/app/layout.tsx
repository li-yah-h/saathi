import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'EchoVoice — Capture Studio',
  description: 'Capture tiles, voice anchors, and manage the Spatial Intensity Matrix.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-3xl px-4 py-6 sm:px-6">{children}</div>
      </body>
    </html>
  );
}
