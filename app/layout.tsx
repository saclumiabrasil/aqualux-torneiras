import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Poppins } from 'next/font/google'
import Script from 'next/script'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const poppins = Poppins({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'AquaLux | Hidratação com estilo e alta performance',
  description:
    'Garrafas premium AquaLux que mantêm sua bebida na temperatura ideal. Design elegante, livre de BPA, frete grátis e envio imediato para todo o Brasil.',
  generator: 'v0.app',
  icons: {
    icon: '/aqualux-badge.png',
    shortcut: '/aqualux-badge.png',
    apple: '/aqualux-badge.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#101a3a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`light ${geistSans.variable} ${geistMono.variable} ${poppins.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        {process.env.NODE_ENV === 'production' && <Analytics />}

        {/* Utmify - Script de UTMs */}
        <Script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-xcod-sck=""
          data-utmify-prevent-subids=""
          strategy="afterInteractive"
        />

        {/* Utmify - Pixel de rastreamento de vendas */}
        <Script id="utmify-pixel" strategy="afterInteractive">
          {`
            window.pixelId = "6a4708779f6cfb5229ae436b";
            var a = document.createElement("script");
            a.setAttribute("async", "");
            a.setAttribute("defer", "");
            a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
            document.head.appendChild(a);
          `}
        </Script>
      </body>
    </html>
  )
}
