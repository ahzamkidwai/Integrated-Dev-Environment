import type { Metadata } from 'next'
import './globals.css'
import { Fira_Code } from 'next/font/google'

const firaCode = Fira_Code({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'unicodeX - Online Code Editor',
  description: 'unicodeX is a free online code editor and compiler',
  icons: [
    {
      hostname: 'unicodeX.vercel.app',
      url: '/favicon.ico',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={firaCode.className}>
      <body>{children}</body>
    </html>
  )
}
