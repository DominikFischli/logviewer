import type { Metadata } from 'next'

import '@/app/ui/globals.css'
import { inter } from '@/app/ui/fonts'

export const metadata: Metadata = {
  title: 'Logviewer',
  description: 'A supporting project to view the logs generated during our seminar project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className='bg-gray-300 h-max w-full'>
          <main className={`${inter.className} antialiased`}>{children}
          </main>
        </div>
      </body>
    </html>
  )
}
