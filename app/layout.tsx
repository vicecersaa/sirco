import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SIRCO — Architecture & Spatial Design',
  description: 'Jakarta-based architecture studio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}