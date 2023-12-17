import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from "next/script";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '人生进度表',
  description: '人生进度表 - 可视化你的人生',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <html lang="en">
      <body className={inter.className}>{children}</body>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-M78LJWJ2HM"></Script>
      </html>
      <Script>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M78LJWJ2HM');
          `
        }
      </Script>
    </>
  )
}
