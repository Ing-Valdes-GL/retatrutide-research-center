import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "Retatrutide Research Center | Advanced Pharmaceutical Research",
    template: "%s | Retatrutide Research Center"
  },
  description: "Retatrutide Research Center provides cutting-edge pharmaceutical research and development with secure logistics across the UK.",
  metadataBase: new URL('https://alluvihealth.store'),
  alternates: { canonical: '/' },
  openGraph: {
    title: "Retatrutide Research Center | Advanced Research",
    description: "Cutting-edge pharmaceutical research and development services.",
    url: 'https://alluvihealth.store',
    siteName: 'Retatrutide Research Center',
    images: [{ url: '/favicon.ico', width: 1200, height: 630, alt: 'RRC Logo' }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retatrutide Research Center',
    description: 'Advanced Pharmaceutical Research.',
    images: ['/logo-share.png'],
  },
  icons: {
    icon: '/logo-share.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
