'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';

export default function Home() {
  // 为动画粒子背景做准备
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "论文快速转换",
      description: "上传学术论文，一键转换为易读科技新闻，节省大量阅读时间",
      icon: "📄",
    },
    {
      title: "多格式支持",
      description: "支持PDF、TXT、DOC等多种格式，拖拽或点击即可上传",
      icon: "📁",
    },
    {
      title: "定制化输出",
      description: "自定义输出风格、长度和侧重点，满足不同阅读需求",
      icon: "⚙️",
    },
  ];

  const steps = [
    {
      title: "上传论文",
      description: "拖拽或点击上传您感兴趣的学术论文",
      icon: "📤",
    },
    {
      title: "设置参数",
      description: "选择输出风格、长度和关注点",
      icon: "🔧",
    },
    {
      title: "获取科技新闻",
      description: "系统快速处理并生成易于理解的科技新闻格式内容",
      icon: "📰",
    },
    {
      title: "阅读与分享",
      description: "阅读转换后的内容，一键分享给朋友",
      icon: "🔄",
    },
  ];

  const testimonials = [
    {
      content: "这款工具帮我节省了大量阅读专业论文的时间，将复杂概念简化为易懂文章。",
      author: "思存，人工智能专业学生",
    },
    {
      content: "作为一名非英语专业学生，这个工具帮我克服了阅读英文论文的障碍，太棒了！",
      author: "子佩，生物技术专业学生",
    },
    {
      content: "界面友好，操作简单，转换质量高，成为我科研路上的得力助手。",
      author: "王芳，物理学专业研究生",
    },
  ];

  const faqs = [
    {
      question: "这个工具支持哪些语言的论文？",
      answer: "目前主要支持英文论文转换，我们正在努力开发更多语言支持。",
    },
    {
      question: "转换后的内容准确性如何？",
      answer: "我们使用先进的AI模型进行转换，保证核心内容的准确性，同时提高可读性。用户可以随时参考原文进行比对。",
    },
    {
      question: "一次可以上传多少篇论文？",
      answer: "目前支持单次上传一篇论文进行转换，后续会推出批量处理功能。",
    },
    {
      question: "如何自定义输出内容？",
      answer: "在上传论文后，您可以设置输出的风格、长度、关注点等参数，系统会根据您的偏好生成内容。",
    },
  ];

  return (
    <div className="relative overflow-x-hidden bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* 动画背景 */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: Math.random() * 60 + 20,
                  height: Math.random() * 60 + 20,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  backgroundColor: `rgba(${
                    Math.floor(Math.random() * 100) + 100
                  }, ${Math.floor(Math.random() * 100) + 100}, ${
                    Math.floor(Math.random() * 100) + 155
                  }, 0.2)`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </motion.div>
        </div>
      )}

      {/* 导航栏 */}
      <Navbar />

      {/* 英雄区域 */}
      <header className="relative z-10 pt-20 pb-16 md:pt-32 md:pb-24 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-600 text-transparent bg-clip-text">
            将复杂论文转换为<br />易读科技新闻
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            帮助大学生快速获取前沿学术知识，不再被晦涩论文困扰
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/workspace" 
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg font-medium">
              开始使用
            </Link>
            <a href="#how-it-works" 
              className="px-8 py-4 bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-lg font-medium">
              了解更多
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative mt-16 max-w-5xl mx-auto"
        >
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden p-2 border border-indigo-100">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-6 md:gap-10">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-gray-500 text-sm">原始论文</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-10 mt-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-full"></div>
                    <div className="h-5 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-4 text-gray-500 text-sm">转换后的科技新闻</span>
                  </div>
                  
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  >
                    <div className="h-7 bg-indigo-100 rounded w-4/5"></div>
                    <div className="h-5 bg-blue-50 rounded w-full mt-2"></div>
                    <div className="h-5 bg-blue-50 rounded w-11/12"></div>
                    <div className="h-5 bg-blue-50 rounded w-full"></div>
                    <div className="h-5 bg-blue-50 rounded w-10/12"></div>
                    <div className="h-10 mt-2"></div>
                    <div className="h-5 bg-blue-50 rounded w-full"></div>
                    <div className="h-5 bg-blue-50 rounded w-4/5"></div>
                  </motion.div>
                </div>
              </div>
              
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* 特色功能 */}
      <section id="features" className="py-16 md:py-24 px-6 relative z-10">
        <div className="container mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              为学术探索提供便捷
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              我们的工具专为大学生设计，帮助您轻松获取前沿学术知识
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all border border-indigo-100 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-6 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 工作流程 */}
      <section id="how-it-works" className="py-16 md:py-24 px-6 bg-gradient-to-b from-indigo-50 to-white relative z-10">
        <div className="container mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              简单四步，获取学术精华
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              只需几分钟，将复杂论文转换为易懂科技新闻
            </p>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* 连接线 */}
          <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-indigo-200 -translate-x-1/2 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative ${index % 2 === 0 ? 'md:text-right' : ''}`}
              >
                <div className={`flex items-center mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                  <div className="z-10 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>
                
                <div className={`bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-indigo-100 ${index % 2 === 0 ? 'md:mr-6' : 'md:ml-6'}`}>
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 用户评价 */}
      <section id="testimonials" className="py-16 md:py-24 px-6 relative z-10">
        <div className="container mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              用户们怎么说
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              听听其他学生使用我们工具的体验
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-xl shadow-lg border border-indigo-100"
              >
                <div className="text-indigo-500 mb-4 text-3xl">❝</div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{testimonial.content}</p>
                <div className="font-medium text-gray-900">{testimonial.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 常见问题 */}
      <section id="faq" className="py-16 md:py-24 px-6 bg-gradient-to-b from-indigo-50 to-white relative z-10">
        <div className="container mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              常见问题
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              了解更多关于我们产品的信息
            </p>
          </motion.div>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-4"
            >
              <details className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all border border-indigo-100 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-6">
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{faq.question}</h3>
                  <span className="text-indigo-500 group-open:rotate-180 transition-transform duration-300">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-300">
                  <p>{faq.answer}</p>
                </div>
              </details>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 行动召唤 */}
      <section className="py-20 md:py-32 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="px-8 py-16 md:p-16 relative">
            {/* 装饰图形 */}
            <div className="absolute right-0 top-0 w-1/3 h-full opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M37.7,-64.7C47.9,-55.1,54.8,-42,65.2,-28.3C75.6,-14.6,89.5,-0.3,90.4,14.4C91.2,29.1,79,44.2,65.9,57.9C52.8,71.5,38.8,83.7,23.3,88.5C7.9,93.4,-8.9,90.8,-24.4,84.9C-39.9,79,-54.2,69.8,-64.5,57.3C-74.8,44.8,-81.1,29,-84.2,12.5C-87.3,-4,-87.2,-21.3,-80.8,-36.5C-74.5,-51.7,-61.8,-64.7,-47.2,-72.6C-32.6,-80.5,-16.3,-83.3,-0.6,-82.3C15,-81.3,30.1,-76.5,37.7,-64.7Z" transform="translate(100 100)" />
              </svg>
            </div>
            <div className="absolute left-0 bottom-0 w-1/4 h-full opacity-10">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFFFFF" d="M45.3,-75.3C58.3,-69.1,68.3,-54.8,75.9,-39.5C83.5,-24.2,88.7,-8,87.4,7.5C86.1,23,78.3,37.8,67.7,49.5C57.1,61.2,43.6,69.9,28.7,76.3C13.9,82.7,-2.4,86.8,-19.4,84.9C-36.5,83,-54.3,75.1,-65.4,62C-76.5,48.9,-80.9,30.7,-84.4,11.7C-88,-7.3,-90.6,-27.1,-84.1,-43.4C-77.5,-59.7,-61.7,-72.5,-45,-76.6C-28.3,-80.7,-10.6,-76.1,3.9,-82.3C18.3,-88.6,33.6,-105.7,45.3,-75.3Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            <div className="text-center text-white relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                开始您的学术探索之旅
              </h2>
              <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
                轻松获取学术前沿知识，让复杂论文不再成为障碍
              </p>
              <Link href="/workspace" 
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-lg font-medium inline-block"
              >
                开始免费使用
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 text-transparent bg-clip-text">
                GenreShift
              </h3>
              <p className="text-gray-400">将复杂论文转换为易读科技新闻，助力学术探索。</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-indigo-400 transition">功能</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-400 transition">工作流程</a></li>
                <li><a href="#testimonials" className="hover:text-indigo-400 transition">用户评价</a></li>
                <li><a href="#faq" className="hover:text-indigo-400 transition">常见问题</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">资源</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-indigo-400 transition">帮助中心</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">API文档</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">使用条款</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition">隐私政策</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <ul className="space-y-2 text-gray-400">
                <li>邮箱：contact@GenreShift.com</li>
                <li>地址：中国·广州</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} GenreShift. 保留所有权利。</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 