'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { getHistoryItem, getDarkMode, setDarkMode } from '../../utils/localStorageManager';

export default function HistoryDetail({ params }) {
  const [historyItem, setHistoryItem] = useState(null);
  const [darkMode, setDarkModeState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 使用 React.use() 来访问 params
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    // 设置主题
    const savedMode = getDarkMode();
    setDarkModeState(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);

    // 加载历史记录详情
    const item = getHistoryItem(id);
    setHistoryItem(item);
    setIsLoading(false);
  }, [id]);

  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!historyItem) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-800 dark:text-gray-200">未找到历史记录</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">该历史记录可能已被删除或不存在</p>
            <Link href="/history" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
              返回历史记录
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              GenreShift
            </Link>
            <div className="hidden md:flex space-x-6 text-gray-600 dark:text-gray-300">
              <Link href="/workspace" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">工作台</Link>
              <Link href="/history" className="text-indigo-600 dark:text-indigo-400 font-medium">历史记录</Link>
              <Link href="/help" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">帮助中心</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* 深色模式切换按钮 */}
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
            
            <Link href="/profile" className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium">
                用户
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">{historyItem.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">原始文件名: {historyItem.originalFileName}</p>
            </div>
            <Link href="/history" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
              返回历史记录
            </Link>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="prose dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: historyItem.content }} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 