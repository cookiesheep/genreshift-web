'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import mammoth from 'mammoth';
// import * as pdfjsLib from 'pdfjs-dist';
import { renderMarkdown, generateOfflineContent } from '../utils/offlineSupport';
import { saveToHistory, getDarkMode, setDarkMode } from '../utils/localStorageManager';

export default function Workspace() {
  // 状态管理
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isParameterPanelOpen, setIsParameterPanelOpen] = useState(true);
  const [showOriginal, setShowOriginal] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  // 添加网络状态检测
  const [isOnline, setIsOnline] = useState(true);
  // 添加后备模式状态
  const [fallbackMode, setFallbackMode] = useState(false);
  const [warning, setWarning] = useState(null);
  // 在状态变量中添加分段处理相关的状态
  const [processingSegments, setProcessingSegments] = useState(0);
  const [totalSegments, setTotalSegments] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);
  
  // 检查网络状态
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // 转换参数
  const [parameters, setParameters] = useState({
    outputStyle: 'news', // news, blog, summary
    length: 'medium', // short, medium, long
    focus: 'general', // general, methodology, results, implications
    language: 'zh', // zh, en
  });

    // 深色模式状态 - 修改使用 localStorage
    const [darkMode, setDarkModeState] = useState(false);

    // 初始化时读取本地存储的深色模式设置
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedMode = getDarkMode();
        setDarkModeState(savedMode);
        document.documentElement.classList.toggle('dark', savedMode);
      }
    }, []);
  
    // 切换深色模式
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkModeState(newMode);
      setDarkMode(newMode);
    };
  
    // 加载PDF.js
    useEffect(() => {
      if (typeof window !== 'undefined' && !window.pdfjsLib) {
        const scriptPdf = document.createElement('script');
        scriptPdf.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/build/pdf.min.js';
        scriptPdf.async = true;
        
        scriptPdf.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.10.377/build/pdf.worker.min.js';
        };
        
        document.body.appendChild(scriptPdf);
      }
    }, []);


      // 处理PDF文件
  const processPdfFile = (selectedFile) => {
    if (!selectedFile) return;
    
    const reader = new FileReader();
    setFile(selectedFile);
    
    reader.onload = async function() {
      try {
        // 确保PDF.js已加载
        if (!window.pdfjsLib) {
          throw new Error("PDF.js库尚未加载，请稍后再试");
        }
        
        const typedArray = new Uint8Array(reader.result);
        const pdf = await window.pdfjsLib.getDocument({ data: typedArray }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n\n';
        }
        
      // 限制内容长度，太长的内容会导致API超时
      const maxContentLength = 25000; // 前端预处理，减少到25000字符
        const content = fullText.substring(0, maxContentLength);
        
        if (fullText.length > maxContentLength) {
        setWarning(`文件内容已被截断至${maxContentLength}字符以避免处理超时。仅处理前${maxContentLength}字符。`);
      } else {
        setWarning(null);
      }
        
      setFileContent(content);
        setIsProcessing(false);
      } catch (error) {
        console.error('PDF处理错误:', error);
        // 回退到简单文本提取
        try {
          const text = new TextDecoder().decode(new Uint8Array(reader.result).slice(0, 1000000));
          
          // 限制内容长度
          const maxContentLength = 25000;
          const content = text.substring(0, maxContentLength);
          
          if (text.length > maxContentLength) {
            setWarning(`文件内容已被截断至${maxContentLength}字符以避免处理超时。仅处理前${maxContentLength}字符。`);
          } else {
            setWarning(null);
          }
          
          setFileContent(`PDF文件内容已提取（简单文本模式）：\n\n${content}`);
        } catch (fallbackError) {
          setFileContent("无法解析PDF文件。如果是扫描件或图片PDF，请尝试上传文本版本。");
        }
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError("PDF文件读取失败");
      setIsProcessing(false);
    };
    
    reader.readAsArrayBuffer(selectedFile);
  };

  // 拖放上传功能
  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // 添加文件大小限制
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError(`文件过大，请上传小于10MB的文件`);
        return;
      }
      
      setFile(selectedFile);
      setIsProcessing(true); // 开始处理
      
      // 根据文件类型使用不同的处理方法
      if (selectedFile.type === 'application/pdf') {
        processPdfFile(selectedFile);
      } 
      else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Word文件处理
        const reader = new FileReader();
        reader.onload = function() {
          mammoth.extractRawText({arrayBuffer: reader.result})
            .then(result => {
              setFileContent(result.value);
              setIsProcessing(false);
            })
            .catch(error => {
              console.error('Word处理错误:', error);
              setError("Word文件处理失败: " + error.message);
              setIsProcessing(false);
            });
        };
        reader.onerror = () => {
          setError("Word文件读取失败");
          setIsProcessing(false);
        };
        reader.readAsArrayBuffer(selectedFile);
      }
      else {
        // 文本文件处理
        processTextFile(selectedFile);
      }
      
      setError(null);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/zip': ['.zip'],
    }
  });

    // 处理参数更改
    const handleParameterChange = (param, value) => {
      setParameters(prev => ({
        ...prev,
        [param]: value
      }));
    };
    
    // 使用Markdown解析函数
    const renderMarkdown = (text) => {
      if (!text) return '';
      
      return text
        .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-200 dark:border-gray-700 pl-4 py-2 my-3 text-gray-600 dark:text-gray-300 italic">$1</blockquote>')
        // 有序列表
        .replace(/^(\d+)\. (.*$)/gim, '<div class="ml-5 list-decimal"><li>$2</li></div>')
        // 无序列表
        .replace(/^- (.*$)/gim, '<div class="ml-5 list-disc"><li>$1</li></div>')
        // 代码块
        .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-md my-3 overflow-x-auto"><code>$1</code></pre>')
        // 链接
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank">$1</a>')
        // 段落
        .replace(/\n\n/gim, '</p><p class="my-2">')
        .replace(/\n/gim, '<br />');
    };
    
    // 生成本地离线处理结果（当API不可用时）
    const generateFallbackResult = () => {
      if (!fileContent) return '';
      
      // 提取内容
      const extractedContent = fileContent.substring(0, 1000);
      const sentences = extractedContent.split(/[.!?。！？]+/).filter(s => s.trim().length > 0);
      const keywords = extractCountKeywords(extractedContent);
      
      const language = parameters.language === 'zh' ? 'zh' : 'en';
      const style = parameters.outputStyle;
      const resultLength = parameters.length;
      
      if (language === 'zh') {
        return generateChineseFallback(sentences, keywords, style, resultLength);
      } else {
        return generateEnglishFallback(sentences, keywords, style, resultLength);
      }
    };
    
    // 提取关键词和出现次数
    const extractCountKeywords = (text) => {
      // 简单的关键词提取
      const words = text.toLowerCase().split(/\s+|[,.;:"'?!，。；：""'？！]/);
      const stopWords = new Set(['the', 'a', 'an', 'in', 'on', 'at', 'of', 'to', 'and', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'this', 'that', 'these', 'those', '的', '了', '和', '与', '是', '在', '有', '被']);
      
      // 统计词频
      const wordCount = {};
      words.forEach(word => {
        if (word.length > 1 && !stopWords.has(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      });
      
      // 排序并返回前10个
      return Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([word]) => word);
    };
    
    // 生成中文后备内容
    const generateChineseFallback = (sentences, keywords, style, resultLength) => {
      // 提取标题
      const title = sentences[0]?.trim() || '论文概述';
      
      // 根据风格选择模板
      let template = '';
      
      if (style === 'news') {
        template = `# ${title.length > 20 ? title.substring(0, 20) + '...' : title}\n\n`;
        template += `**关键要点**: ${keywords.slice(0, 5).join('、')}\n\n`;
        template += `${sentences.slice(0, 3).join('。')}。\n\n`;
        
        if (resultLength !== 'short') {
          template += `## 研究背景\n\n${sentences.slice(3, 5).join('。')}。\n\n`;
          template += `## 研究方法\n\n据研究团队介绍，他们采用了创新的研究方法进行分析。${sentences.slice(5, 7).join('。')}。\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## 研究意义\n\n这项研究对${keywords[0]}领域具有重要意义。${sentences.slice(7, 10).join('。')}。\n\n`;
          template += `## 未来展望\n\n研究团队表示，未来将继续深入研究这一问题，进一步探索${keywords.slice(1, 3).join('和')}的关系。\n\n`;
        }
        
        template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
      } else if (style === 'blog') {
        template = `# 探索${keywords[0]}的新视角：${title.length > 15 ? title.substring(0, 15) + '...' : title}\n\n`;
        template += `近期，一项关于${keywords.slice(0, 3).join('、')}的研究引起了我的注意。${sentences.slice(0, 3).join('。')}。\n\n`;
        
        if (resultLength !== 'short') {
          template += `## 为什么这很重要？\n\n${sentences.slice(3, 6).join('。')}。这些发现对于理解${keywords[0]}具有重要意义。\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## 深入分析\n\n如果仔细分析这项研究，我们可以发现几个关键点：\n\n- ${keywords[0]}与${keywords[1]}之间存在密切关联\n- 研究方法新颖，采用了创新的分析框架\n- 结果对${keywords[2]}领域提供了新的思路\n\n`;
          template += `## 我的看法\n\n个人认为，这项研究虽然有价值，但仍有改进空间。未来研究可以更深入地探索${keywords.slice(3, 5).join('和')}的关系。\n\n`;
        }
        
        template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
      } else {
        // 摘要
        template = `# ${title}摘要\n\n`;
        template += `**核心概念**: ${keywords.slice(0, 5).join('、')}\n\n`;
        template += `${sentences.slice(0, 3).join('。')}。\n\n`;
        
        if (resultLength !== 'short') {
          template += `## 主要内容\n\n${sentences.slice(3, 8).join('。')}。\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## 研究结论\n\n基于以上内容，研究得出以下结论：\n\n- 关于${keywords[0]}的新发现\n- ${keywords[1]}与${keywords[2]}的关系\n- 对${keywords[3]}理论的验证\n\n`;
        }
        
        template += `*注：本内容由系统离线生成，仅作参考。由于网络原因，无法获取完整的转换结果。*`;
      }
      
      return template;
    };
    
    // 生成英文后备内容
    const generateEnglishFallback = (sentences, keywords, style, resultLength) => {
      // 类似的逻辑，但生成英文内容
      // 提取标题
      const title = sentences[0]?.trim() || 'Paper Overview';
      
      // 根据风格选择模板
      let template = '';
      
      if (style === 'news') {
        template = `# ${title.length > 20 ? title.substring(0, 20) + '...' : title}\n\n`;
        template += `**Key Points**: ${keywords.slice(0, 5).join(', ')}\n\n`;
        template += `${sentences.slice(0, 3).join('. ')}.\n\n`;
        
        if (resultLength !== 'short') {
          template += `## Research Background\n\n${sentences.slice(3, 5).join('. ')}.\n\n`;
          template += `## Methodology\n\nAccording to the research team, they employed innovative research methods for analysis. ${sentences.slice(5, 7).join('. ')}.\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## Significance\n\nThis research has important implications for the field of ${keywords[0]}. ${sentences.slice(7, 10).join('. ')}.\n\n`;
          template += `## Future Prospects\n\nThe research team stated that they will continue to study this issue in depth, further exploring the relationship between ${keywords.slice(1, 3).join(' and ')}.\n\n`;
        }
        
        template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
      } else if (style === 'blog') {
        // Blog style in English
        template = `# A New Perspective on ${keywords[0]}: ${title.length > 15 ? title.substring(0, 15) + '...' : title}\n\n`;
        template += `Recently, a study on ${keywords.slice(0, 3).join(', ')} caught my attention. ${sentences.slice(0, 3).join('. ')}.\n\n`;
        
        if (resultLength !== 'short') {
          template += `## Why This Matters\n\n${sentences.slice(3, 6).join('. ')}. These findings are significant for understanding ${keywords[0]}.\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## In-Depth Analysis\n\nIf we analyze this research carefully, we can identify several key points:\n\n- There is a close connection between ${keywords[0]} and ${keywords[1]}\n- The research method is novel, using an innovative analytical framework\n- The results provide new insights for the field of ${keywords[2]}\n\n`;
          template += `## My Take\n\nPersonally, I believe that while this research is valuable, there is still room for improvement. Future research could explore more deeply the relationship between ${keywords.slice(3, 5).join(' and ')}.\n\n`;
        }
        
        template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
      } else {
        // Summary in English
        template = `# Summary of ${title}\n\n`;
        template += `**Core Concepts**: ${keywords.slice(0, 5).join(', ')}\n\n`;
        template += `${sentences.slice(0, 3).join('. ')}.\n\n`;
        
        if (resultLength !== 'short') {
          template += `## Main Content\n\n${sentences.slice(3, 8).join('. ')}.\n\n`;
        }
        
        if (resultLength === 'long') {
          template += `## Research Conclusions\n\nBased on the above content, the study draws the following conclusions:\n\n- New findings about ${keywords[0]}\n- The relationship between ${keywords[1]} and ${keywords[2]}\n- Validation of theories regarding ${keywords[3]}\n\n`;
        }
        
        template += `*Note: This content is generated offline by the system for reference only. Due to network issues, the complete conversion result cannot be obtained.*`;
      }
      
      return template;
    };
  
    // 转换论文
    const convertPaper = async (retryAttempt = 0) => {
      if (!fileContent) {
        setError("请先上传或输入论文内容");
        return;
      }

      setIsProcessing(true);
      setProcessingProgress(0);
      setError(null);
      setProcessingSegments(0);
      setTotalSegments(0);
      setCurrentSegment(0);

      // 检查内容长度
      let processedContent = fileContent;
      if (fileContent.length > 25000) {
        setWarning("内容超过25000字符，将被截断处理");
        processedContent = fileContent.substring(0, 25000);
      }

      // 将内容分段
      const segments = [];
      const segmentSize = 2000;
      for (let i = 0; i < processedContent.length; i += segmentSize) {
        segments.push(processedContent.substring(i, i + segmentSize));
      }

      setTotalSegments(segments.length);
      let allResults = [];

      // 分段处理
      for (let i = 0; i < segments.length; i++) {
        setCurrentSegment(i);
        setProcessingProgress((i / segments.length) * 100);

        try {
          const response = await axios.post('/api/transform', {
            content: segments[i],
            parameters: {
              outputStyle: parameters.outputStyle,
              length: parameters.length,
              focus: parameters.focus,
              language: parameters.language
            }
          });

          if (response.data.error) {
            throw new Error(response.data.error);
          }

          allResults.push(response.data.result);
        } catch (error) {
          console.error('处理段落时出错:', error);
          setError(
            <div>
              <p>处理第 {i + 1} 段内容时出错: {error.message}</p>
              <button 
                onClick={() => convertPaper(retryAttempt + 1)}
                className="mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm hover:bg-indigo-200 transition"
              >
                重试转换
              </button>
            </div>
          );
          setIsProcessing(false);
          return;
        }
      }

      // 合并所有结果
      const finalResult = allResults.join('\n\n');
      setConvertedText(finalResult);
      setShowOriginal(false);
      setIsProcessing(false);
      setProcessingProgress(100);

      // 保存到历史记录
      if (file) {
        saveToHistory({
          title: file.name,
          content: finalResult,
          originalFileName: file.name,
          outputStyle: parameters.outputStyle,
          date: new Date().toISOString().slice(0, 10)
        });
      }
    };
  
    // 复制结果到剪贴板
    const copyToClipboard = () => {
      navigator.clipboard.writeText(convertedText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    };
  
    // 加载状态指示器组件，添加更详细的信息
    const LoadingIndicator = ({ text }) => (
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <div className="w-20 h-20 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-medium text-indigo-600 dark:text-indigo-400">{text}</p>
        {totalSegments > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            正在处理第 {currentSegment + 1}/{totalSegments} 段内容
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md text-center">
          {processingProgress < 50 
            ? "正在处理您的文件，大型文件可能需要更长时间..." 
            : processingProgress < 90 
              ? "正在生成易读内容，请耐心等待..." 
              : "正在优化输出格式，即将完成..."}
        </p>
        <div className="mt-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${processingProgress}%` }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{Math.round(processingProgress)}%</p>
      </div>
    );

    // 文本文件处理逻辑
    const processTextFile = (selectedFile) => {
      const reader = new FileReader();
      reader.onload = () => {
        // 限制内容长度
        const maxContentLength = 25000;
        const content = reader.result.substring(0, maxContentLength);
        
        if (reader.result.length > maxContentLength) {
          setWarning(`文件内容已被截断至${maxContentLength}字符以避免处理超时。仅处理前${maxContentLength}字符。`);
        } else {
          setWarning(null);
        }
        
        // 将内容分段
        const segments = [];
        const segmentSize = 2000;
        for (let i = 0; i < content.length; i += segmentSize) {
          segments.push(content.substring(i, i + segmentSize));
        }
        
        setFileContent(content);
        setTotalSegments(segments.length);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError("文件读取失败");
        setIsProcessing(false);
      };
      reader.readAsText(selectedFile);
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        {/* 导航栏 */}
        <nav className="sticky top-0 z-50 px-6 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text">
                GenreShift
              </span>
            </Link>
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
  
              <Link href="/history" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                历史记录
              </Link>
              <div className="relative">
                <button className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className="container mx-auto px-4 py-6 md:py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          论文转换工作台
        </h1>
        
        {/* 主布局 - 在大屏幕上是左右两栏，在小屏幕上是上下布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧操作区 */}
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-[calc(100vh-240px)] md:min-h-[600px] flex flex-col">
            {/* 参数面板切换按钮 */}
            <button 
              onClick={() => setIsParameterPanelOpen(!isParameterPanelOpen)}
              className="absolute left-2 top-2 z-10 p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg transition-all"
              aria-label={isParameterPanelOpen ? '关闭参数面板' : '打开参数面板'}
            >
              <svg 
                className={`w-5 h-5 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${isParameterPanelOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isParameterPanelOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </button>
            
            {/* 参数设置面板 */}
            <AnimatePresence>
              {isParameterPanelOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mb-6 bg-indigo-50 dark:bg-gray-700/50 rounded-lg p-4"
                >
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-3">转换参数</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 输出风格 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">输出风格</label>
                      <div className="flex space-x-2">
                        {[
                          { id: 'news', label: '新闻' },
                          { id: 'blog', label: '博客' },
                          { id: 'summary', label: '摘要' }
                        ].map(option => (
                          <button
                            key={option.id}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                              parameters.outputStyle === option.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                            }`}
                            onClick={() => handleParameterChange('outputStyle', option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* 输出长度 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">输出长度</label>
                      <div className="flex space-x-2">
                        {[
                          { id: 'short', label: '简短' },
                          { id: 'medium', label: '适中' },
                          { id: 'long', label: '详细' }
                        ].map(option => (
                          <button
                            key={option.id}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                              parameters.length === option.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                            }`}
                            onClick={() => handleParameterChange('length', option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* 关注点 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">内容关注点</label>
                      <select
                        value={parameters.focus}
                        onChange={(e) => handleParameterChange('focus', e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                      >
                        <option value="general">综合内容</option>
                        <option value="methodology">研究方法</option>
                        <option value="results">研究结果</option>
                        <option value="implications">研究意义</option>
                      </select>
                    </div>
                    
                    {/* 输出语言 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">输出语言</label>
                      <div className="flex space-x-2">
                        {[
                          { id: 'zh', label: '中文' },
                          { id: 'en', label: '英文' }
                        ].map(option => (
                          <button
                            key={option.id}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                              parameters.language === option.id 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-500'
                            }`}
                            onClick={() => handleParameterChange('language', option.id)}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* 文件上传区域 */}
            <div className="flex-1 flex flex-col">
              <div
                {...getRootProps()}
                className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all ${
                  isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                } ${file ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
              >
                <input {...getInputProps()} />
                
                {file ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{file.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {(file.size / 1024).toFixed(2)} KB · {file.type || '未知类型'}
                    </p>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setFileContent('');
                      }}
                      className="mt-4 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm hover:bg-red-200 dark:hover:bg-red-800/40 transition"
                    >
                      删除文件
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 text-center">
                      {isDragActive ? '释放文件以上传' : '拖放或点击上传论文'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                      支持 PDF(文本格式)、TXT、DOCX 和 ZIP 文件
                      <br />
                      <span className="text-xs">注：扫描件或图片PDF可能无法正确提取文本</span>
                    </p>
                  </>
                )}
              </div>
            </div>
            {/* 错误提示 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">
                <p className="font-medium">出错了</p>
                {error}
              </div>
            )}
            
            {/* 警告提示 - 内容过长 */}
            {warning && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg text-sm">
                <p className="font-medium">⚠️ 注意</p>
                <p>{warning}</p>
              </div>
            )}
            
            {/* 操作按钮 */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={convertPaper}
                disabled={!file || isProcessing}
                className={`px-6 py-3 rounded-xl font-medium text-white shadow-md transition-all transform ${
                  !file || isProcessing 
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                {isProcessing ? '正在转换...' : '开始转换'}
              </button>
            </div>
            
            {/* 处理进度条 */}
            {isProcessing && (
              <LoadingIndicator text={
                processingProgress < 50 
                  ? "正在处理您的文件，大型文件可能需要更长时间..." 
                  : processingProgress < 90 
                    ? "正在生成易读内容，请耐心等待..." 
                    : "正在优化输出格式，即将完成..."
              } />
            )}
          </div>  
          {/* 右侧结果展示区 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-[calc(100vh-240px)] md:min-h-[600px] flex flex-col">
            {/* 选项卡切换 */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all ${
                  showOriginal 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setShowOriginal(true)}
              >
                原始论文
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-all ${
                  !showOriginal 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                onClick={() => setShowOriginal(false)}
              >
                转换结果
              </button>
            </div>
            
            {/* 内容区域 */}
            <div className="flex-1 overflow-auto p-6">
              {showOriginal ? (
                file ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">{file.name}</h2>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg whitespace-pre-wrap text-gray-800 dark:text-gray-200 h-[calc(100%-70px)] overflow-auto">
                      {fileContent || '正在加载内容...'}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-lg">转换后的内容将显示在这里</p>
                  </div>
                )
              ) : (      
                convertedText ? (
                  <div className="relative">
                    <div className="prose prose-indigo dark:prose-invert max-w-none">
                      <div 
                        className="markdown-content" 
                        dangerouslySetInnerHTML={{ 
                          __html: renderMarkdown(convertedText)
                        }}
                      />
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex justify-end mt-6 space-x-3">
                      <motion.button
                        onClick={copyToClipboard}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium flex items-center transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        {copied ? '已复制' : '复制'}
                      </motion.button>
                      
                      {!isOnline && (
                        <motion.button
                          onClick={() => {
                            if (navigator.onLine) {
                              convertPaper();
                            } else {
                              setError(<p>您当前处于离线状态，请连接网络后重试</p>);
                            }
                          }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium flex items-center transition"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          重新尝试
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium flex items-center transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        分享
                      </motion.button>
                      
                      <motion.button
                        onClick={() => {
                          if (convertedText) {
                            saveToHistoryRecord();
                          }
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center transition"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        保存
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p className="text-lg">转换后的内容将显示在这里</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 加载状态 */}
      {isProcessing && (
        <LoadingIndicator text={
          processingProgress < 50 
            ? "正在处理您的文件，大型文件可能需要更长时间..." 
            : processingProgress < 90 
              ? "正在生成易读内容，请耐心等待..." 
              : "正在优化输出格式，即将完成..."
        } />
      )}
    </div>
  );
}
        