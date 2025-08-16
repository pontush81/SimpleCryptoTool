import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Simple Crypto Tool - Enkla Kryptosignaler',
  description: 'Enkla signaler för kryptomarknaden - inte finansiell rådgivning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
