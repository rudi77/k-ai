import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/layout/Header'
import Sidebar from '../components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Invoice Extractor',
  description: 'Extract information from your invoices using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        <Header />
        <main className="min-h-screen bg-gray-50 pl-[240px] pt-16">
          <div className="mx-auto max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
} 