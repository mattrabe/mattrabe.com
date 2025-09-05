import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import iconLight from './icon-light.png'
import iconDark from './icon-dark.png'

import './ui/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Matt Rabe',
  description: 'Matt Rabe is a software engineer, musician, woodworker, and father.',
  icons: [
    {
      media: '(prefers-color-scheme: light)',
      url: iconLight.src,
      type: 'image/svg+xml',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: iconDark.src,
      type: 'image/svg+xml',
    },
  ],
  openGraph: {
    'firstName': 'Matt',
    'lastName': 'Rabe',
    'locale': 'en_US',
    'type': 'profile',
    'url': 'https://mattrabe.com',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
