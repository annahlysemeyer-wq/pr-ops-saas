import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MuniFlow - Municipal workflows made simple',
  description: 'Streamline your city communications and workflows with MuniFlow.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}