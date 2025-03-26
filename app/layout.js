import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PaperNews - 将学术论文转换为科技新闻',
  description: '帮助大学生快速获取前沿学术知识，PaperNews将复杂论文转换为易懂科技新闻',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
} 