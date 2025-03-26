'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // 初始化时读取本地存储
  useEffect(() => {
    const savedMode = localStorage.getItem('theme') === 'dark';
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
  }, []);

  // 切换主题
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
          GenreShift
          </Link>
          <div className="hidden md:flex space-x-6 text-gray-600">
            <Link href="/workspace" className={`transition ${pathname === '/workspace' ? 'text-indigo-600 font-medium' : 'hover:text-indigo-600'}`}>
              工作台
            </Link>
            <Link href="/history" className={`transition ${pathname === '/history' ? 'text-indigo-600 font-medium' : 'hover:text-indigo-600'}`}>
              历史记录
            </Link>
            <Link href="/help" className={`transition ${pathname === '/help' ? 'text-indigo-600 font-medium' : 'hover:text-indigo-600'}`}>
              帮助中心
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
              </svg>
            )}
          </button>
          <Link href="/profile" className={`flex items-center ${pathname === '/profile' ? 'ring-2 ring-indigo-300' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium">
              用户
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
} 