import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'GenreShift - 将学术论文转换为科技新闻',
  description: '帮助大学生快速获取前沿学术知识，GenreShift将复杂论文转换为易懂科技新闻',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>{children}</body>
    </html>
  )
} 