'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getUserSettings, saveUserSettings, getHistoryItems, getDarkMode, setDarkMode } from '../utils/localStorageManager';

export default function Profile() {
  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    name: '用户',
    email: '',
    avatar: null,
  });
  
  // 偏好设置状态
  const [preferences, setPreferences] = useState({
    defaultOutputStyle: 'blog',
    language: 'zh',
    apiModel: 'qwen-turbo',
    maxHistoryItems: 50
  });
  
  // API使用状态
  const [apiUsage, setApiUsage] = useState({
    totalRequests: 0,
    remainingCredits: 0,
    requestsThisMonth: 0,
    creditsResetDate: '',
  });
  
  // 编辑状态
  const [editingUserInfo, setEditingUserInfo] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  
  // 表单状态
  const [userForm, setUserForm] = useState({...userInfo});
  const [preferencesForm, setPreferencesForm] = useState({...preferences});
  
  // 暗色模式状态
  const [darkMode, setDarkModeState] = useState(false);
  
  // 历史记录计数
  const [historyCount, setHistoryCount] = useState(0);
  
  // 初始加载
  useEffect(() => {
    // 读取暗色模式状态
    const savedMode = getDarkMode();
    setDarkModeState(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
    
    // 从本地存储加载设置
    const settings = getUserSettings();
    if (settings) {
      // 提取用户信息
      if (settings.userInfo) {
        setUserInfo(settings.userInfo);
        setUserForm(settings.userInfo);
      }
      
      // 提取偏好设置
      if (settings.preferences) {
        setPreferences(settings.preferences);
        setPreferencesForm(settings.preferences);
      }
      
      // 提取API使用统计（当前为模拟数据，实际应从服务器获取）
      const mockApiUsage = {
        totalRequests: Math.floor(Math.random() * 100),
        remainingCredits: Math.floor(Math.random() * 1000),
        requestsThisMonth: Math.floor(Math.random() * 50),
        creditsResetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
      };
      setApiUsage(mockApiUsage);
    }
    
    // 获取历史记录数量
    const historyItems = getHistoryItems();
    setHistoryCount(historyItems.length);
  }, []);
  
  // 切换深色模式
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkModeState(newMode);
    setDarkMode(newMode);
  };
  
  // 更新用户信息
  const updateUserInfo = () => {
    setUserInfo(userForm);
    
    // 保存到本地存储
    const settings = getUserSettings();
    settings.userInfo = userForm;
    saveUserSettings(settings);
    
    setEditingUserInfo(false);
  };
  
  // 更新偏好设置
  const updatePreferences = () => {
    setPreferences(preferencesForm);
    
    // 保存到本地存储
    const settings = getUserSettings();
    settings.preferences = preferencesForm;
    saveUserSettings(settings);
    
    setEditingPreferences(false);
  };
  
  // 取消编辑
  const cancelEditing = (type) => {
    if (type === 'userInfo') {
      setUserForm({...userInfo});
      setEditingUserInfo(false);
    } else if (type === 'preferences') {
      setPreferencesForm({...preferences});
      setEditingPreferences(false);
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
              <Link href="/history" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">历史记录</Link>
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
                {userInfo.name ? userInfo.name.charAt(0) : '用户'}
              </div>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">个人中心</h1>
          <p className="text-gray-600 dark:text-gray-400">查看和管理您的个人信息和偏好设置</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧区域 - 个人信息 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 个人信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">个人信息</h2>
                {!editingUserInfo ? (
                  <button 
                    onClick={() => setEditingUserInfo(true)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    编辑
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => cancelEditing('userInfo')}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      取消
                    </button>
                    <button 
                      onClick={updateUserInfo}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      保存
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                {!editingUserInfo ? (
                  <div className="flex items-start">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white text-2xl font-semibold">
                      {userInfo.name ? userInfo.name.charAt(0) : '用户'}
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">{userInfo.name || '用户'}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{userInfo.email || '未设置邮箱'}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          历史记录: {historyCount} 条
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">名称</label>
                      <input 
                        type="text" 
                        value={userForm.name || ''} 
                        onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="请输入您的名称"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">邮箱</label>
                      <input 
                        type="email" 
                        value={userForm.email || ''} 
                        onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="请输入您的邮箱"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* 偏好设置卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">偏好设置</h2>
                {!editingPreferences ? (
                  <button 
                    onClick={() => setEditingPreferences(true)}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    编辑
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => cancelEditing('preferences')}
                      className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                      取消
                    </button>
                    <button 
                      onClick={updatePreferences}
                      className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      保存
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                {!editingPreferences ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">默认输出样式</h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        {preferences.defaultOutputStyle === 'news' && '新闻'}
                        {preferences.defaultOutputStyle === 'blog' && '博客'}
                        {preferences.defaultOutputStyle === 'summary' && '摘要'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">语言偏好</h3>
                      <p className="text-gray-800 dark:text-gray-200">
                        {preferences.language === 'zh' && '中文'}
                        {preferences.language === 'en' && '英文'}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">API 模型</h3>
                      <p className="text-gray-800 dark:text-gray-200">{preferences.apiModel}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">历史记录保存上限</h3>
                      <p className="text-gray-800 dark:text-gray-200">{preferences.maxHistoryItems} 条</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">默认输出样式</label>
                      <select 
                        value={preferencesForm.defaultOutputStyle} 
                        onChange={(e) => setPreferencesForm({...preferencesForm, defaultOutputStyle: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="news">新闻</option>
                        <option value="blog">博客</option>
                        <option value="summary">摘要</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">语言偏好</label>
                      <select 
                        value={preferencesForm.language} 
                        onChange={(e) => setPreferencesForm({...preferencesForm, language: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="zh">中文</option>
                        <option value="en">英文</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API 模型</label>
                      <select 
                        value={preferencesForm.apiModel} 
                        onChange={(e) => setPreferencesForm({...preferencesForm, apiModel: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="qwen-turbo">Qwen Turbo (快速)</option>
                        <option value="qwen-plus">Qwen Plus (平衡)</option>
                        <option value="qwen-max">Qwen Max (强大)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">历史记录保存上限</label>
                      <select 
                        value={preferencesForm.maxHistoryItems} 
                        onChange={(e) => setPreferencesForm({...preferencesForm, maxHistoryItems: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="20">20 条</option>
                        <option value="50">50 条</option>
                        <option value="100">100 条</option>
                        <option value="200">200 条</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 右侧区域 - 状态和链接 */}
          <div className="space-y-8">
            {/* API使用统计卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">API 使用统计</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">总请求数</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{apiUsage.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">本月请求数</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{apiUsage.requestsThisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">剩余额度</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{apiUsage.remainingCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">额度重置日期</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{apiUsage.creditsResetDate}</span>
                </div>
                <div className="pt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (apiUsage.requestsThisMonth / 100) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                    本月已使用 {apiUsage.requestsThisMonth}/100 次
                  </p>
                </div>
              </div>
            </div>
            
            {/* 快速操作卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">快速操作</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link 
                  href="/workspace" 
                  className="block p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition flex items-center"
                >
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">前往工作台</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">上传论文并进行转换</p>
                  </div>
                </Link>
                <Link 
                  href="/history" 
                  className="block p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition flex items-center"
                >
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">历史记录</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">查看所有转换过的论文</p>
                  </div>
                </Link>
                <Link 
                  href="/help" 
                  className="block p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition flex items-center"
                >
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">帮助中心</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">获取使用指南和常见问题解答</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 