'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import mammoth from 'mammoth';
// import * as pdfjsLib from 'pdfjs-dist';

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
  
  // 转换参数
  const [parameters, setParameters] = useState({
    outputStyle: 'news', // news, blog, summary
    length: 'medium', // short, medium, long
    focus: 'general', // general, methodology, results, implications
    language: 'zh', // zh, en
  });

    // 深色模式状态
    const [darkMode, setDarkMode] = useState(false);

    // 初始化时读取本地存储的深色模式设置
    useEffect(() => {
      if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('theme') === 'dark';
        setDarkMode(savedMode);
        document.documentElement.classList.toggle('dark', savedMode);
      }
    }, []);
  
    // 切换深色模式
    const toggleDarkMode = () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newMode);
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
    const reader = new FileReader();
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
        
        setFileContent(fullText.substring(0, 100000));
        setIsProcessing(false);
      } catch (error) {
        console.error('PDF处理错误:', error);
        // 回退到简单文本提取
        try {
          const text = new TextDecoder().decode(new Uint8Array(reader.result).slice(0, 1000000));
          setFileContent(`PDF文件内容已提取（简单文本模式）：\n\n${text.substring(0, 100000)}`);
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
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result.substring(0, 100000);
          setFileContent(content);
          setIsProcessing(false);
        };
        reader.onerror = () => {
          setError("文件读取失败");
          setIsProcessing(false);
        };
        reader.readAsText(selectedFile);
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
    
    // 转换论文
    const convertPaper = async () => {
      if (!file) {
        setError("请先上传论文文件");
        return;
      }
      
      setIsProcessing(true);
      setProcessingProgress(0);
      setError(null);
      
      // 模拟进度到75%
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 75) {
            clearInterval(progressInterval);
            return 75;
          }
          return prev + 0.5;
        });
      }, 100);
      
      try {
        // 限制内容长度，防止请求过大
        const contentToSend = fileContent.substring(0, 5000); // 缩短为5000字符
        
        console.log('发送API请求，内容长度:', contentToSend.length);
        console.log('参数:', parameters);
        
        // 使用API接口
        const response = await axios.post('/api/transform', {
          content: contentToSend,
          parameters
        });
        
        console.log('API响应成功:', response.status);
        
        // API调用完成
        clearInterval(progressInterval);
        setProcessingProgress(95);
        
        // 最后5%缓慢完成
        const finalInterval = setInterval(() => {
          setProcessingProgress(prev => {
            if (prev >= 100) {
              clearInterval(finalInterval);
              setTimeout(() => {
                setConvertedText(response.data.result);
                setShowOriginal(false);
                setIsProcessing(false);
              }, 500);
              return 100;
            }
            return prev + 0.2;
          });
        }, 50);
        
      } catch (error) {
        clearInterval(progressInterval);
        console.error('转换过程出错详情:', error);
        
        // 提供更详细的错误信息
        let errorMessage = "转换过程中发生错误";
        
        if (error.response) {
          // 服务器响应了，但状态码不在2xx范围
          console.error('服务器响应状态:', error.response.status);
          console.error('服务器响应数据:', error.response.data);
          errorMessage = `服务器错误 (${error.response.status}): ${error.response.data.error || '未知错误'}`;
        } else if (error.request) {
          // 请求已发送但没有收到响应
          console.error('没有收到服务器响应');
          errorMessage = "服务器没有响应，请检查网络连接";
        } else {
          // 请求设置时出错
          console.error('请求设置错误:', error.message);
          errorMessage = `请求错误: ${error.message}`;
        }
        
        setError(errorMessage);
        setIsProcessing(false);
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
  
    // 加载状态指示器组件
    const LoadingIndicator = ({ text }) => (
      <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex flex-col items-center justify-center z-10">
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-600 dark:text-indigo-400 font-medium">{text}</p>
      </div>
    );

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
                <p>{error}</p>
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
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${processingProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-right">{processingProgress}%</p>
              </div>
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
                          __html: convertedText
                            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
                            .replace(/\*(.*)\*/gim, '<em>$1</em>')
                            .replace(/\n/gim, '<br />')
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
            ? "正在处理您的文件..." 
            : processingProgress < 90 
              ? "正在生成科技新闻..." 
              : "即将完成..."
        } />
      )}
    </div>
  );
}
        