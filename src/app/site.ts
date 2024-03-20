const baseSiteConfig = {
  name: "人生时光轴",
  description:
    "人生时光轴，回顾逝去的时光，展望未来",
  url: "<https://lifetime.zshnb.com>",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Client Components",
    "Material UI",
    "人生",
    "时光",
    "未来"
  ],
  authors: [
    {
      name: "别处理",
      url: "<https://blog.zshnb.com>",
    }
  ],
  creator: '@zshnb',
  themeColor: '#fff',
  // 可以在这个网站生成所有平台的ico：<https://realfavicongenerator.net/>
  icons: {
    icon: "/favicon.ico",
    shortcut: "",
    apple: "",
  },
  ogImage: "",
  links: {
    twitter: "<https://twitter.com/zhengsihua_dev>",
    github: "<https://github.com/zshnb/lifetime-visualization>",
  },
}

export const siteConfig = {
  ...baseSiteConfig,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseSiteConfig.url,
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    siteName: baseSiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: baseSiteConfig.name,
    description: baseSiteConfig.description,
    images: [`${baseSiteConfig.url}/og.png`],
    creator: baseSiteConfig.creator,
  },
}
