import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'Glea AI — Turn Images Into Videos',
  description:
    'Glea AI turns your photos into stunning AI-generated videos. Upload an image, describe the motion, add dialogue and a voice, then generate.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#c026a8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
