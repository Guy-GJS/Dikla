import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'
import { AuthProvider } from '@/components/AuthProvider'
import { DialogProvider } from '@/components/DialogProvider'

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
      <body>
        <AuthProvider>
          <DialogProvider>{children}</DialogProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

