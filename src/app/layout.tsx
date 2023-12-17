import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from "next/script";
import {siteConfig} from "@/app/site";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  icons: siteConfig.icons,
  openGraph: siteConfig.openGraph,
  twitter: siteConfig.twitter,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head>
        <link rel='icon' href='favicon.ico'/>
      </head>
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
