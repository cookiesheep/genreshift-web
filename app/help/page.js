'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getDarkMode, setDarkMode } from '../utils/localStorageManager';

export default function Help() {
  const [activeTab, setActiveTab] = useState('guide');
  const [darkMode, setDarkModeState] = useState(false);
  
  // 初始加载
  useEffect(() => {
    // 读取暗色模式状态
    const savedMode = getDarkMode();
    setDarkModeState(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
  }, []);
  
  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
  };

  // FAQ数据
  const faqs = [
    {
      question: "GenreShift可以处理多长的论文？",
      answer: "GenreShift可以处理大多数标准长度的学术论文。不过，由于API处理限制，我们对内容长度有25,000字符的限制。超出此限制的内容将被截断，并显示警告提示。建议对特别长的论文分段处理或选择最有价值的部分进行转换。"
    },
    {
      question: "支持哪些文件格式？",
      answer: "目前支持PDF格式的学术论文和TXT文本文件。我们正在努力扩展支持更多的文件格式，如DOCX、LaTeX等。"
    },
    {
      question: "转换的内容保存在哪里？",
      answer: "所有转换结果都保存在您浏览器的本地存储中，可以在'历史记录'页面查看。请注意，清除浏览器缓存可能会导致历史记录丢失。未来我们将支持云端存储功能。"
    },
    {
      question: "如何选择合适的输出样式？",
      answer: "您可以根据需求选择不同的输出样式。'新闻'风格适合通俗易懂的表达；'博客'风格更加个性化和生动；'摘要'风格则提供简明扼要的重点内容概述。根据您的目标受众和用途选择合适的风格。"
    },
    {
      question: "如何提高转换质量？",
      answer: "要获得更好的转换效果，建议：1) 上传清晰可辨的PDF文件；2) 选择合适的内容关注点，如'研究方法'或'研究结果'；3) 如果原文较长，可以提取最相关的部分进行转换；4) 使用更强大的API模型（可在个人中心设置）。"
    },
    {
      question: "转换失败怎么办？",
      answer: "如果转换失败，您可以：1) 检查网络连接是否稳定；2) 尝试重新上传文件；3) 减少文件大小或内容长度；4) 确认文件格式正确且内容可读；5) 如多次尝试仍然失败，可能是我们的API服务暂时遇到问题，请稍后再试。"
    },
    {
      question: "如何分享我的转换结果？",
      answer: "目前您可以通过复制转换后的内容来分享。在转换结果页面，点击'复制到剪贴板'按钮，然后将内容粘贴到您希望的地方。我们计划在未来版本中添加直接分享链接的功能。"
    },
    {
      question: "GenreShift的API使用限制是什么？",
      answer: "免费用户每月可以进行100次转换操作。转换次数会在每月初重置。您可以在个人中心查看当前的使用情况。如需更多转换额度，敬请期待我们即将推出的专业版计划。"
    }
  ];

  // 用户指南内容
  const userGuides = [
    {
      title: "快速开始",
      content: (
        <>
          <p className="mb-3">
            GenreShift 是一个将学术论文转换为易于理解的格式的工具。它使用人工智能技术，帮助您更轻松地理解复杂的学术内容。
          </p>
          <p className="mb-3">使用 GenreShift 只需几个简单步骤：</p>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li>访问<Link href="/workspace" className="text-indigo-600 dark:text-indigo-400 hover:underline">工作台</Link>页面</li>
            <li>上传PDF格式的学术论文或者输入文本内容</li>
            <li>选择输出样式（新闻、博客或摘要）</li>
            <li>选择关注点和语言</li>
            <li>点击"转换"按钮</li>
            <li>等待片刻，查看转换结果</li>
          </ol>
          <p>转换完成后，您可以复制、分享或保存结果。所有历史转换记录都会保存在<Link href="/history" className="text-indigo-600 dark:text-indigo-400 hover:underline">历史记录</Link>页面。</p>
        </>
      )
    },
    {
      title: "上传文件指南",
      content: (
        <>
          <p className="mb-3">GenreShift 支持以下文件类型：</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>PDF 文件（学术论文、研究报告等）</li>
            <li>TXT 文本文件</li>
          </ul>
          <p className="mb-3">上传文件时请注意：</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>文件大小不应超过10MB</li>
            <li>PDF文件应确保文本可选择（非扫描图像）</li>
            <li>文本长度不应超过25,000字符，超出部分将被截断</li>
            <li>含有过多公式、表格或图表的文件可能会影响转换质量</li>
          </ul>
          <p>您也可以直接复制粘贴文本内容到输入框，而不用上传文件。</p>
        </>
      )
    },
    {
      title: "输出样式说明",
      content: (
        <>
          <p className="mb-4">GenreShift 提供三种不同的输出样式，以满足不同的阅读需求：</p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">新闻风格</h4>
          <p className="mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
            以客观、简明的方式呈现论文内容，类似于新闻报道。重点突出研究的主要发现和重要信息，适合需要快速了解研究概况的读者。
          </p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">博客风格</h4>
          <p className="mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
            采用更加个性化、生动的表达方式，使内容更加易读和有趣。加入更多解释性内容和背景信息，适合希望深入但轻松理解研究内容的读者。
          </p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">摘要风格</h4>
          <p className="mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700">
            提供简洁扼要的研究概述，重点突出论文的主要观点、方法和结论。适合需要快速把握论文核心内容的读者。
          </p>
          
          <p>您可以根据自己的需求和偏好选择合适的输出样式。也可以在个人中心设置默认的输出样式。</p>
        </>
      )
    },
    {
      title: "历史记录管理",
      content: (
        <>
          <p className="mb-4">GenreShift 会自动保存您的转换历史记录，方便您随时查看和管理。</p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">查看历史记录</h4>
          <p className="mb-3">
            访问<Link href="/history" className="text-indigo-600 dark:text-indigo-400 hover:underline">历史记录</Link>页面可以查看所有之前转换过的内容。历史记录按时间倒序排列，最新的转换结果显示在最前面。
          </p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">管理历史记录</h4>
          <p className="mb-3">在历史记录页面，您可以：</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>查看完整的转换结果</li>
            <li>删除单条历史记录</li>
            <li>清空所有历史记录</li>
            <li>按文件名、日期或内容类型筛选记录</li>
            <li>对历史记录进行排序</li>
          </ul>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">历史记录存储</h4>
          <p className="mb-3">
            所有历史记录都保存在浏览器的本地存储中。请注意以下几点：
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>清除浏览器缓存会导致历史记录丢失</li>
            <li>历史记录只能在当前设备和浏览器中访问</li>
            <li>您可以在个人中心设置历史记录的最大保存数量</li>
          </ul>
          
          <p>在未来的版本中，我们计划添加云端同步功能，让您可以在不同设备间同步历史记录。</p>
        </>
      )
    },
    {
      title: "隐私与数据安全",
      content: (
        <>
          <p className="mb-4">GenreShift 重视您的隐私和数据安全。以下是我们对您上传内容的处理方式：</p>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">上传内容处理</h4>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>您上传的文件仅用于转换处理，不会被永久存储在我们的服务器上</li>
            <li>文件内容在处理完成后会立即从服务器中删除</li>
            <li>转换结果仅保存在您的本地浏览器中</li>
          </ul>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">API 调用</h4>
          <p className="mb-3">
            我们使用第三方 AI 服务进行内容转换。在此过程中：
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>您的内容会通过加密连接发送给 AI 服务提供商</li>
            <li>内容不会被用于训练 AI 模型</li>
            <li>所有通信均采用 HTTPS 加密协议</li>
          </ul>
          
          <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">本地存储</h4>
          <p className="mb-3">
            GenreShift 使用浏览器的本地存储功能来保存：
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>转换历史记录</li>
            <li>用户偏好设置</li>
            <li>界面主题选择</li>
          </ul>
          
          <p className="mb-3">
            您可以随时删除这些本地存储数据，或者通过清除浏览器缓存完全移除所有数据。
          </p>
          
          <p>我们承诺保护您的数据安全，不会收集或共享您的个人信息或上传内容。</p>
        </>
      )
    }
  ];

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
              <Link href="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">历史记录</Link>
              <Link href="/help" className="text-indigo-600 dark:text-indigo-400 transition">帮助中心</Link>
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
                U
              </div>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">帮助中心</h1>
          <p className="text-gray-600 dark:text-gray-400">了解如何充分利用 GenreShift 的全部功能</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* 选项卡标题 */}
          <div className="flex border-b border-gray-100 dark:border-gray-700">
            <button 
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'guide' 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              onClick={() => setActiveTab('guide')}
            >
              用户指南
            </button>
            <button 
              className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'faq' 
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              onClick={() => setActiveTab('faq')}
            >
              常见问题
            </button>
          </div>

          {/* 选项卡内容 */}
          <div className="p-6">
            {activeTab === 'guide' ? (
              <div className="space-y-10">
                {userGuides.map((guide, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{guide.title}</h3>
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {guide.content}
                    </div>
                    {index < userGuides.length - 1 && (
                      <div className="border-b border-gray-100 dark:border-gray-700 mt-10"></div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-700 dark:text-gray-300 mb-6">以下是用户常见的问题和答案。如果您没有找到需要的信息，请联系我们的支持团队。</p>
                
                {faqs.map((faq, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5"
                  >
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 联系我们 */}
        <div className="mt-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-md overflow-hidden">
          <div className="p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">需要更多帮助？</h2>
            <p className="mb-6 opacity-90">如果您在使用 GenreShift 时遇到任何问题，或者有改进建议，请随时联系我们的支持团队。</p>
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition">
              联系我们
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}