import type { Metadata } from 'next'
import { Suez_One } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'

const suezOne = Suez_One({
  weight: '400',
  subsets: ['latin', 'hebrew'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'פריטי - מוצרי יד שנייה',
  description: 'המקום הטוב ביותר לקנות ולמכור מוצרי יד שנייה בישראל',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={suezOne.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

