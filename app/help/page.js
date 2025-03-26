'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Help() {
  // 状态管理
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('faq');
  const [expandedFaqs, setExpandedFaqs] = useState([0]);
  const [activeGuide, setActiveGuide] = useState(0);
  
  // FAQ数据
  const faqs = [
    {
      question: "PaperNews支持哪些格式的论文上传？",
      answer: "PaperNews目前支持PDF、TXT、DOC/DOCX和ZIP格式的论文上传。您可以通过拖拽或点击上传按钮来上传文件。我们会自动解析文件内容并进行转换。",
      category: "general"
    },
    {
      question: "转换后的内容准确度如何？",
      answer: "我们使用先进的AI模型进行转换，确保核心内容的准确性同时提高可读性。转换质量取决于原始论文的质量和复杂度。用户可以通过调整转换参数来获得更符合需求的结果，也可以随时参考原文进行比对。",
      category: "general"
    },
    {
      question: "如何设置转换输出的风格和长度？",
      answer: "在工作台页面上传论文后，您可以在转换参数面板中设置输出风格（新闻、博客或摘要）、内容长度（简短、中等或详细）以及内容关注点（综合、方法、结果或意义）。您也可以在用户中心设置默认参数。",
      category: "usage"
    },
    {
      question: "我可以保存或分享转换结果吗？",
      answer: "是的，每次转换结果都可以通过界面上的保存按钮保存到您的历史记录中，也可以使用分享按钮生成分享链接发送给他人。此外，您还可以直接复制转换内容或下载为文本文件。",
      category: "usage"
    },
    {
      question: "PaperNews可以一次处理多篇论文吗？",
      answer: "目前，PaperNews一次只能处理一篇论文。不过，您可以使用ZIP格式打包多个相关文件一起上传，系统会尝试整合这些文件内容。我们正在开发批量处理功能，未来版本将支持多篇论文同时转换。",
      category: "usage"
    },
    {
      question: "免费账户有使用限制吗？",
      answer: "是的，免费账户每月可以转换100篇论文。超过限额后，您需要等到下个月初额度刷新，或者升级到专业版获取更高额度。您可以在用户中心查看当前的使用情况。",
      category: "account"
    },
    {
      question: "专业版有哪些额外功能？",
      answer: "专业版除了提供更高的月度转换配额外，还包括：批量处理功能、更高级的定制化选项、优先处理队列、API访问权限以及无水印导出。详细信息请查看我们的价格页面。",
      category: "account"
    },
    {
      question: "如何保障我上传论文的安全性和隐私？",
      answer: "我们非常重视用户数据安全。您上传的所有论文内容仅用于提供转换服务，不会用于其他目的或与第三方共享。所有数据传输都经过加密，而且您可以随时从账户中删除历史记录。更多信息请参阅我们的隐私政策。",
      category: "security"
    },
  ];
  
  // 使用指南数据
  const guides = [
    {
      title: "上传论文",
      steps: [
        '访问"工作台"页面，您会看到左侧的上传区域',
        "将论文文件拖放到上传区域，或点击区域选择文件",
        "支持的格式包括PDF、TXT、DOC/DOCX和ZIP",
        "上传后，文件内容会显示在右侧预览区"
      ],
      image: "/guides/upload.svg"
    },
    {
      title: "设置转换参数",
      steps: [
        "在左侧参数面板中选择所需的输出风格：新闻、博客或摘要",
        "调整内容长度：简短、中等或详细",
        "选择内容关注点：综合内容、研究方法、研究结果或研究意义",
        "根据需要选择输出语言"
      ],
      image: "/guides/settings.svg"
    },
    {
      title: "转换与查看结果",
      steps: [
        '设置好参数后，点击"开始转换"按钮',
        "等待转换完成，进度条会显示处理状态",
        '转换完成后，切换到"转换结果"标签查看内容',
        "可以使用底部的复制、分享或保存按钮进行后续操作"
      ],
      image: "/guides/convert.svg"
    },
    {
      title: "管理历史记录",
      steps: [
        '访问"历史记录"页面查看所有转换过的论文',
        "使用搜索框或筛选器快速找到特定记录",
        "点击记录可以查看详情，或使用操作按钮进行管理",
        "可以重新转换、分享、下载或删除历史记录"
      ],
      image: "/guides/history.svg"
    },
  ];
  
  // 筛选FAQ
  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // 切换FAQ展开状态
  const toggleFaq = (index) => {
    if (expandedFaqs.includes(index)) {
      setExpandedFaqs(expandedFaqs.filter(i => i !== index));
    } else {
      setExpandedFaqs([...expandedFaqs, index]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
              PaperNews
            </Link>
            <div className="hidden md:flex space-x-6 text-gray-600">
              <Link href="/workspace" className="hover:text-indigo-600 transition">工作台</Link>
              <Link href="/history" className="hover:text-indigo-600 transition">历史记录</Link>
              <Link href="/help" className="text-indigo-600 font-medium">帮助中心</Link>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-4">帮助中心</h1>
          <p className="text-gray-600">找到您问题的答案，了解如何充分利用PaperNews</p>
        </div>
        
        {/* 搜索栏 */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            placeholder="搜索您的问题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* 内容导航 */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveCategory('faq')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeCategory === 'faq' 
                  ? 'bg-white shadow text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              常见问题
            </button>
            <button
              onClick={() => setActiveCategory('guides')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeCategory === 'guides' 
                  ? 'bg-white shadow text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              使用指南
            </button>
            <button
              onClick={() => setActiveCategory('contact')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                activeCategory === 'contact' 
                  ? 'bg-white shadow text-indigo-700' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              联系我们
            </button>
          </div>
        </div>
        
        {/* 内容区域 */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* FAQ 内容 */}
            {activeCategory === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* FAQ 分类筛选 */}
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => setSearchTerm('')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      searchTerm === '' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    全部
                  </button>
                  <button
                    onClick={() => setSearchTerm('general')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      searchTerm === 'general' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    基本问题
                  </button>
                  <button
                    onClick={() => setSearchTerm('usage')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      searchTerm === 'usage' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    使用方法
                  </button>
                  <button
                    onClick={() => setSearchTerm('account')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      searchTerm === 'account' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    账户相关
                  </button>
                  <button
                    onClick={() => setSearchTerm('security')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                      searchTerm === 'security' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    安全隐私
                  </button>
                </div>
              
                {/* FAQ 列表 */}
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-sm overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(index)}
                          className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                        >
                          <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                          <svg 
                            className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaqs.includes(index) ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        <AnimatePresence>
                          {expandedFaqs.includes(index) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 pb-4"
                            >
                              <p className="text-gray-600">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-xl shadow-sm p-8 text-center"
                    >
                      <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">未找到相关问题</h3>
                      <p className="text-gray-600">请尝试其他关键词，或通过联系我们页面寻求支持。</p>
                    </motion.div>
                  )}
                </div>
                
                {/* 未找到答案 */}
                <div className="mt-12 text-center">
                  <p className="text-gray-600 mb-4">没有找到您需要的答案？</p>
                  <button 
                    onClick={() => setActiveCategory('contact')}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                  >
                    联系我们
                  </button>
                </div>
              </motion.div>
            )}
            
            {/* 使用指南内容 */}
            {activeCategory === 'guides' && (
              <motion.div
                key="guides"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* 指南导航 */}
                <div className="flex overflow-x-auto pb-2 mb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="flex space-x-2">
                    {guides.map((guide, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveGuide(index)}
                        className={`px-4 py-2 whitespace-nowrap text-sm font-medium rounded-lg transition ${
                          activeGuide === index 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {guide.title}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 指南内容 */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeGuide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">{guides[activeGuide].title}</h2>
                      
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* 图片（实际项目中应替换为真实图片） */}
                        <div className="bg-indigo-50 rounded-lg h-64 flex items-center justify-center">
                          <svg className="w-24 h-24 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        
                        {/* 步骤列表 */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-800 mb-4">操作步骤</h3>
                          <ol className="space-y-4">
                            {guides[activeGuide].steps.map((step, stepIndex) => (
                              <motion.li 
                                key={stepIndex}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: stepIndex * 0.1 }}
                                className="flex"
                              >
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600 font-medium">
                                  {stepIndex + 1}
                                </div>
                                <p className="text-gray-600 pt-1">{step}</p>
                              </motion.li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      
                      {/* 底部导航 */}
                      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => setActiveGuide(prev => Math.max(0, prev - 1))}
                          disabled={activeGuide === 0}
                          className={`px-4 py-2 flex items-center rounded transition ${
                            activeGuide === 0 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          上一步
                        </button>
                        
                        <button
                          onClick={() => setActiveGuide(prev => Math.min(guides.length - 1, prev + 1))}
                          disabled={activeGuide === guides.length - 1}
                          className={`px-4 py-2 flex items-center rounded transition ${
                            activeGuide === guides.length - 1
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          下一步
                          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
            
            {/* 联系我们内容 */}
            {activeCategory === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm p-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">联系我们</h2>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">联系方式</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">电子邮件</h4>
                          <p className="text-indigo-600">support@papernews.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">在线客服</h4>
                          <p className="text-indigo-600">工作日 9:00-18:00</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3 text-indigo-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">客服热线</h4>
                          <p className="text-indigo-600">400-123-4567</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">留言表单</h3>
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          您的姓名
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="请输入姓名"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          电子邮箱
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="请输入邮箱"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          问题类型
                        </label>
                        <select
                          id="subject"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">请选择问题类型</option>
                          <option value="usage">使用问题</option>
                          <option value="account">账户问题</option>
                          <option value="billing">付款问题</option>
                          <option value="bug">Bug反馈</option>
                          <option value="feature">功能建议</option>
                          <option value="other">其他问题</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          详细描述
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="请详细描述您的问题或建议..."
                        ></textarea>
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium"
                      >
                        提交
                      </button>
                    </form>
                  </div>
                </div>
                
                {/* 常见问题快捷链接 */}
                <div className="border-t border-gray-100 pt-6 mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">热门问题</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {faqs.slice(0, 4).map((faq, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveCategory('faq');
                          setExpandedFaqs([index]);
                          setSearchTerm('');
                        }}
                        className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                      >
                        <h4 className="text-sm font-medium text-gray-800">{faq.question}</h4>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
} 