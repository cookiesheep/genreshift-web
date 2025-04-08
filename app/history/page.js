'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getHistoryItems, deleteHistoryItem, deleteHistoryItems, clearAllHistory, getDarkMode, setDarkMode } from '../utils/localStorageManager';

export default function History() {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, news, blog, summary
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, title-asc, title-desc
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkModeState] = useState(false);
  
  // 历史记录数据
  const [historyItems, setHistoryItems] = useState([]);
  
  // 每页显示数量
  const itemsPerPage = 5;
  
  // 初始化加载数据和主题
  useEffect(() => {
    // 设置主题
    const savedMode = getDarkMode();
    setDarkModeState(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
    
    // 加载历史记录
    loadHistoryData();
  }, []);
  
  // 加载历史记录数据
  const loadHistoryData = () => {
    setIsLoading(true);
    
    // 短暂延迟以显示加载状态
    setTimeout(() => {
      const items = getHistoryItems();
      setHistoryItems(items);
      setIsLoading(false);
    }, 300);
  };
  
  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
  };
  
  // 处理搜索和筛选
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesFilter = filter === 'all' || item.outputStyle === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  // 处理排序
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
  
  // 分页
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // 切换选择项
  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(item => item.id));
    }
  };
  
  // 确认删除
  const confirmDelete = (id = null) => {
    if (id) {
      setItemToDelete(id);
    }
    setShowDeleteConfirm(true);
  };
  
  // 执行删除
  const executeDelete = () => {
    if (itemToDelete) {
      // 删除单个项目
      if (deleteHistoryItem(itemToDelete)) {
        loadHistoryData(); // 重新加载数据
        setSelectedItems(selectedItems.filter(id => id !== itemToDelete));
      }
    } else if (selectedItems.length > 0) {
      // 批量删除
      const deletedCount = deleteHistoryItems(selectedItems);
      if (deletedCount > 0) {
        loadHistoryData(); // 重新加载数据
        setSelectedItems([]);
      }
    } else if (selectedItems.length === 0 && !itemToDelete) {
      // 清空所有
      if (clearAllHistory()) {
        loadHistoryData(); // 重新加载数据
      }
    }
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };
  
  // 获取样式类名
  const getOutputStyleClass = (style) => {
    switch (style) {
      case 'news':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'blog':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'summary':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // 获取样式显示名称
  const getOutputStyleName = (style) => {
    switch (style) {
      case 'news':
        return '新闻';
      case 'blog':
        return '博客';
      case 'summary':
        return '摘要';
      default:
        return '未知';
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">历史记录</h1>
          <p className="text-gray-600 dark:text-gray-400">查看、管理您转换过的所有论文</p>
        </div>
        
        {/* 功能区 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* 搜索框 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索标题或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 lg:w-80"
              />
            </div>
            
            {/* 筛选器 */}
            <div className="flex flex-wrap gap-2">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm"
              >
                <option value="all">全部类型</option>
                <option value="news">新闻</option>
                <option value="blog">博客</option>
                <option value="summary">摘要</option>
              </select>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm"
              >
                <option value="date-desc">最新优先</option>
                <option value="date-asc">最早优先</option>
                <option value="title-asc">标题 A-Z</option>
                <option value="title-desc">标题 Z-A</option>
              </select>
              
              <button 
                onClick={() => confirmDelete()}
                disabled={!selectedItems.length && historyItems.length === 0}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                  selectedItems.length > 0
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {selectedItems.length > 0 ? `删除 (${selectedItems.length})` : '删除'}
              </button>
            </div>
          </div>
        </div>
        
        {/* 历史记录列表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* 列表头部 */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 px-6 py-3">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={currentItems.length > 0 && selectedItems.length === currentItems.length}
                  onChange={toggleSelectAll}
                  disabled={currentItems.length === 0}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="col-span-5 md:col-span-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                标题
              </div>
              <div className="col-span-2 hidden md:block text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                类型
              </div>
              <div className="col-span-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                日期
              </div>
              <div className="col-span-3 md:col-span-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                操作
              </div>
            </div>
          </div>
          
          {/* 加载状态 */}
          {isLoading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {/* 无数据状态 */}
              {currentItems.length === 0 ? (
                <div className="py-16 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p className="mt-4 text-gray-500 dark:text-gray-400">
                    {searchTerm || filter !== 'all' ? '没有符合条件的记录' : '暂无历史记录'}
                  </p>
                  <Link href="/workspace" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    前往工作台
                  </Link>
                </div>
              ) : (
                <>
                  {/* 列表项 */}
                  {currentItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-1 flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </div>
                        <div className="col-span-5 md:col-span-4">
                          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.originalFileName}</p>
                        </div>
                        <div className="col-span-2 hidden md:block">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOutputStyleClass(item.outputStyle)}`}>
                            {getOutputStyleName(item.outputStyle)}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                        </div>
                        <div className="col-span-3 md:col-span-2 flex justify-end items-center space-x-2">
                          <Link 
                            href={`/history/${item.id}`}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
          
          {/* 分页控制 */}
          {totalPages > 1 && (
            <div className="px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                显示 {Math.min((currentPage - 1) * itemsPerPage + 1, sortedItems.length)} - {Math.min(currentPage * itemsPerPage, sortedItems.length)} 条，共 {sortedItems.length} 条
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* 删除确认对话框 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">确认删除</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {itemToDelete
                    ? '确定要删除这条历史记录吗？此操作无法撤销。'
                    : selectedItems.length > 0
                      ? `确定要删除选中的 ${selectedItems.length} 条历史记录吗？此操作无法撤销。`
                      : '确定要清空所有历史记录吗？此操作无法撤销。'
                  }
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={executeDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 