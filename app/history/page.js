'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
  
  // 模拟历史记录数据
  const [historyItems, setHistoryItems] = useState([]);
  
  // 每页显示数量
  const itemsPerPage = 5;
  
  // 初始化加载数据
  useEffect(() => {
    // 模拟API加载
    setTimeout(() => {
      const mockData = [
        {
          id: 1,
          title: "人工智能在自然语言处理中的新突破",
          originalFileName: "AI_NLP_Research_2023.pdf",
          date: "2023-11-15",
          outputStyle: "news",
          previewText: "科技日报讯 近日，一项发表在《科学》杂志上的研究展示了人工智能在理解和生成人类语言方面的重大突破...",
          tags: ["AI", "NLP", "研究"],
        },
        {
          id: 2,
          title: "新型纳米材料提高太阳能电池效率研究",
          originalFileName: "Solar_Cell_Efficiency.pdf",
          date: "2023-11-10",
          outputStyle: "blog",
          previewText: "一项发表在《自然·材料》上的研究展示了一种新型纳米结构材料，可将太阳能电池的转换效率提高近30%...",
          tags: ["能源", "纳米技术", "材料科学"],
        },
        {
          id: 3,
          title: "脑科学研究揭示记忆形成机制",
          originalFileName: "Brain_Memory_Research.pdf",
          date: "2023-11-05",
          outputStyle: "summary",
          previewText: "近日，一项发表在《神经科学》杂志上的研究揭示了大脑形成长期记忆的全新机制...",
          tags: ["脑科学", "神经科学", "医学"],
        },
        {
          id: 4,
          title: "量子计算在药物开发中的应用研究",
          originalFileName: "Quantum_Computing_Drug_Discovery.pdf",
          date: "2023-10-28",
          outputStyle: "news",
          previewText: "据科技日报报道，研究人员利用量子计算技术加速了新药分子的筛选过程，大幅缩短了药物研发周期...",
          tags: ["量子计算", "医药", "化学"],
        },
        {
          id: 5,
          title: "气候变化对海洋生态系统的影响",
          originalFileName: "Climate_Ocean_Ecosystem.pdf",
          date: "2023-10-20",
          outputStyle: "blog",
          previewText: "最新研究表明，全球气温上升正以前所未有的速度影响海洋生态系统，珊瑚礁面临前所未有的威胁...",
          tags: ["气候", "海洋", "生态"],
        },
        {
          id: 6,
          title: "机器学习在金融风险预测中的应用",
          originalFileName: "ML_Financial_Risk.pdf",
          date: "2023-10-15",
          outputStyle: "summary",
          previewText: "本研究探讨了机器学习算法在金融市场风险评估中的应用，提出了一种新的预测模型...",
          tags: ["机器学习", "金融", "风险分析"],
        },
        {
          id: 7,
          title: "基因编辑技术CRISPR的最新进展",
          originalFileName: "CRISPR_Advances.pdf",
          date: "2023-10-07",
          outputStyle: "news",
          previewText: "科学家们利用改进的CRISPR技术成功治疗了小鼠模型中的遗传性疾病，为人类基因疗法带来新希望...",
          tags: ["基因编辑", "生物技术", "医学"],
        },
      ];
      
      setHistoryItems(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // 处理搜索和筛选
  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
      setHistoryItems(historyItems.filter(item => item.id !== itemToDelete));
      setSelectedItems(selectedItems.filter(id => id !== itemToDelete));
    } else {
      // 批量删除
      setHistoryItems(historyItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };
  
  // 获取样式类名
  const getOutputStyleClass = (style) => {
    switch (style) {
      case 'news':
        return 'bg-blue-100 text-blue-800';
      case 'blog':
        return 'bg-purple-100 text-purple-800';
      case 'summary':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              PaperNews
            </Link>
            <div className="hidden md:flex space-x-6 text-gray-600">
              <Link href="/workspace" className="hover:text-indigo-600 transition">工作台</Link>
              <Link href="/history" className="text-indigo-600 font-medium">历史记录</Link>
              <Link href="/help" className="hover:text-indigo-600 transition">帮助中心</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">历史记录</h1>
          <p className="text-gray-600">查看、管理您转换过的所有论文</p>
        </div>
        
        {/* 功能区 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* 搜索框 */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="搜索标题或标签..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 lg:w-80"
              />
            </div>
            
            {/* 筛选和排序 */}
            <div className="flex items-center space-x-3">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">所有类型</option>
                <option value="news">新闻</option>
                <option value="blog">博客</option>
                <option value="summary">摘要</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="date-desc">最新优先</option>
                <option value="date-asc">最早优先</option>
                <option value="title-asc">标题 A-Z</option>
                <option value="title-desc">标题 Z-A</option>
              </select>
            </div>
          </div>
          
          {/* 批量操作 */}
          {selectedItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center"
            >
              <p className="text-sm text-gray-600">已选择 {selectedItems.length} 项</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedItems([])}
                  className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition"
                >
                  取消选择
                </button>
                <button
                  onClick={() => confirmDelete()}
                  className="px-3 py-1.5 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded transition"
                >
                  批量删除
                </button>
              </div>
            </motion.div>
          )}
        </div>
        
        {/* 历史记录列表 */}
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : currentItems.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center px-4 py-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">全选</span>
                </label>
              </div>
              
              {currentItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <label className="inline-flex items-center mt-1 mr-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition">
                              <Link href={`/history/${item.id}`}>
                                {item.title}
                              </Link>
                            </h3>
                            <div className="flex items-center mt-1.5 space-x-3 text-sm text-gray-500">
                              <span>原文件: {item.originalFileName}</span>
                              <span>•</span>
                              <span>{new Date(item.date).toLocaleDateString('zh-CN')}</span>
                            </div>
                          </div>
                          
                          <div className="mt-2 md:mt-0">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getOutputStyleClass(item.outputStyle)}`}>
                              {getOutputStyleName(item.outputStyle)}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{item.previewText}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 cursor-pointer transition"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Link 
                            href={`/history/${item.id}`} 
                            className="text-sm px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            查看
                          </Link>
                          
                          <Link 
                            href={`/workspace?edit=${item.id}`} 
                            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            重新转换
                          </Link>
                          
                          <button 
                            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            下载
                          </button>
                          
                          <button 
                            className="text-sm px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            分享
                          </button>
                          
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="text-sm px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded text-sm ${
                        currentPage === 1 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      上一页
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 rounded text-sm ${
                        currentPage === totalPages 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      下一页
                    </button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-md p-12 text-center"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无转换记录</h3>
              <p className="text-gray-600 mb-6">您还没有转换过任何论文，或没有符合当前筛选条件的记录。</p>
              <Link 
                href="/workspace" 
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                开始转换论文
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* 删除确认对话框 */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
              <p className="text-gray-600 mb-6">
                {itemToDelete 
                  ? '确定要删除这条转换记录吗？此操作无法撤销。' 
                  : `确定要删除选中的 ${selectedItems.length} 条记录吗？此操作无法撤销。`
                }
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  取消
                </button>
                <button
                  onClick={executeDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 