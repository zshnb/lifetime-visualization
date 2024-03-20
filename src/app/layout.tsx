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
        <title>人生时光轴</title>
      </head>
      <html lang="en" className='bg-[#F1EFE4] dark:bg-slate-800'>
      <body className={inter.className}>{children}</body>
      </html>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-5KPCVF925B"></Script>
      <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5129204676047532" crossOrigin={'anonymous'}></Script>
      <Script>
        {
          `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-5KPCVF925B');
          `
        }
      </Script>
    </>
  )
}
