'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Profile() {
  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    name: '测试用户',
    email: 'test@example.com',
    avatar: null,
    joinDate: '2023-10-01',
  });
  
  // 偏好设置状态
  const [preferences, setPreferences] = useState({
    defaultOutputStyle: 'news',
    defaultLength: 'medium',
    defaultFocus: 'general',
    defaultLanguage: 'zh',
    saveHistory: true,
    darkMode: false,
  });
  
  // API使用统计
  const [apiStats, setApiStats] = useState({
    totalConverts: 27,
    monthlyConverts: 12,
    quota: {
      limit: 100,
      used: 27,
      resetDate: '2023-12-01',
    }
  });
  
  // 编辑模式状态
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  
  // 临时编辑数据
  const [editableUserInfo, setEditableUserInfo] = useState({...userInfo});
  const [editablePreferences, setEditablePreferences] = useState({...preferences});
  
  // 处理个人信息更新
  const handleProfileUpdate = () => {
    setUserInfo(editableUserInfo);
    setIsEditingProfile(false);
  };
  
  // 处理偏好设置更新
  const handlePreferencesUpdate = () => {
    setPreferences(editablePreferences);
    setIsEditingPreferences(false);
  };
  
  // 处理偏好设置变更
  const handlePreferenceChange = (key, value) => {
    setEditablePreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // 计算API使用进度百分比
  const apiUsagePercentage = (apiStats.quota.used / apiStats.quota.limit) * 100;

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
              <Link href="/help" className="hover:text-indigo-600 transition">帮助中心</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/profile" className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium">
                {userInfo.name.charAt(0)}
              </div>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">用户中心</h1>
          <p className="text-gray-600">管理您的账户信息与偏好设置</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧栏 - 个人信息 */}
          <div className="lg:col-span-1 space-y-8">
            {/* 个人信息卡片 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="relative bg-gradient-to-r from-indigo-500 to-blue-500 h-32">
                <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6 w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                    {userInfo.name.charAt(0)}
                  </div>
                </div>
                
                <div className="pt-14">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>
                      <p className="text-gray-600">{userInfo.email}</p>
                      <p className="text-sm text-gray-500 mt-1">加入时间: {userInfo.joinDate}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditableUserInfo({...userInfo});
                        setIsEditingProfile(!isEditingProfile);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      编辑
                    </button>
                  </div>
                  
                  {isEditingProfile && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            用户名
                          </label>
                          <input
                            type="text"
                            id="name"
                            value={editableUserInfo.name}
                            onChange={(e) => setEditableUserInfo({...editableUserInfo, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            电子邮箱
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={editableUserInfo.email}
                            onChange={(e) => setEditableUserInfo({...editableUserInfo, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            onClick={() => setIsEditingProfile(false)}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition"
                          >
                            取消
                          </button>
                          <button
                            onClick={handleProfileUpdate}
                            className="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded transition"
                          >
                            保存
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* API使用统计卡片 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">API使用统计</h3>
                <span className="text-sm bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5">
                  免费版
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">本月使用量</span>
                    <span className="text-sm font-medium">{apiStats.quota.used} / {apiStats.quota.limit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${apiUsagePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">重置日期: {apiStats.quota.resetDate}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-indigo-600">{apiStats.totalConverts}</p>
                    <p className="text-xs text-gray-600">总转换次数</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-indigo-600">{apiStats.monthlyConverts}</p>
                    <p className="text-xs text-gray-600">本月转换</p>
                  </div>
                </div>
                
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition text-sm font-medium">
                  升级到专业版
                </button>
              </div>
            </motion.div>
          </div>
          
          {/* 右侧栏 - 设置选项 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 偏好设置卡片 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">偏好设置</h3>
                <button 
                  onClick={() => {
                    setEditablePreferences({...preferences});
                    setIsEditingPreferences(!isEditingPreferences);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  {isEditingPreferences ? '取消' : '编辑'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 默认输出风格 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认输出风格
                    </label>
                    {isEditingPreferences ? (
                      <select
                        value={editablePreferences.defaultOutputStyle}
                        onChange={(e) => handlePreferenceChange('defaultOutputStyle', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="news">新闻</option>
                        <option value="blog">博客</option>
                        <option value="summary">摘要</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                        {preferences.defaultOutputStyle === 'news' ? '新闻' : 
                         preferences.defaultOutputStyle === 'blog' ? '博客' : '摘要'}
                      </div>
                    )}
                  </div>
                  
                  {/* 默认内容长度 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认内容长度
                    </label>
                    {isEditingPreferences ? (
                      <select
                        value={editablePreferences.defaultLength}
                        onChange={(e) => handlePreferenceChange('defaultLength', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="short">简短</option>
                        <option value="medium">中等</option>
                        <option value="long">详细</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                        {preferences.defaultLength === 'short' ? '简短' : 
                         preferences.defaultLength === 'medium' ? '中等' : '详细'}
                      </div>
                    )}
                  </div>
                  
                  {/* 默认关注点 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认关注点
                    </label>
                    {isEditingPreferences ? (
                      <select
                        value={editablePreferences.defaultFocus}
                        onChange={(e) => handlePreferenceChange('defaultFocus', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="general">综合内容</option>
                        <option value="methodology">研究方法</option>
                        <option value="results">研究结果</option>
                        <option value="implications">研究意义</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                        {preferences.defaultFocus === 'general' ? '综合内容' : 
                         preferences.defaultFocus === 'methodology' ? '研究方法' : 
                         preferences.defaultFocus === 'results' ? '研究结果' : '研究意义'}
                      </div>
                    )}
                  </div>
                  
                  {/* 默认语言 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      默认语言
                    </label>
                    {isEditingPreferences ? (
                      <select
                        value={editablePreferences.defaultLanguage}
                        onChange={(e) => handlePreferenceChange('defaultLanguage', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="zh">中文</option>
                        <option value="en">英文</option>
                      </select>
                    ) : (
                      <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">
                        {preferences.defaultLanguage === 'zh' ? '中文' : '英文'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 space-y-4">
                  {/* 保存历史记录 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">保存历史记录</h4>
                      <p className="text-xs text-gray-500">自动保存所有转换的论文记录</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isEditingPreferences ? editablePreferences.saveHistory : preferences.saveHistory}
                        onChange={isEditingPreferences ? 
                          () => handlePreferenceChange('saveHistory', !editablePreferences.saveHistory) : 
                          () => {}}
                        className="sr-only peer"
                        disabled={!isEditingPreferences}
                      />
                      <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 
                        ${(isEditingPreferences ? editablePreferences.saveHistory : preferences.saveHistory) ? 
                          'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-indigo-600' : ''}
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
                      </div>
                    </label>
                  </div>
                  
                  {/* 深色模式 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">深色模式</h4>
                      <p className="text-xs text-gray-500">启用界面深色主题</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isEditingPreferences ? editablePreferences.darkMode : preferences.darkMode}
                        onChange={isEditingPreferences ? 
                          () => handlePreferenceChange('darkMode', !editablePreferences.darkMode) : 
                          () => {}}
                        className="sr-only peer"
                        disabled={!isEditingPreferences}
                      />
                      <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 
                        ${(isEditingPreferences ? editablePreferences.darkMode : preferences.darkMode) ? 
                          'peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-indigo-600' : ''}
                        after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}>
                      </div>
                    </label>
                  </div>
                </div>
                
                {isEditingPreferences && (
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handlePreferencesUpdate}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      保存设置
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* 账户安全卡片 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">账户安全</h3>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">修改密码</h4>
                    <p className="text-xs text-gray-500">上次更新: 从未</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    修改
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">两步验证</h4>
                    <p className="text-xs text-gray-500">增强账户安全性</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    启用
                  </button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">API密钥管理</h4>
                    <p className="text-xs text-gray-500">管理您的个人API密钥</p>
                  </div>
                  <button className="px-3 py-1.5 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    查看
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* 账户操作 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">账户操作</h3>
              
              <div className="space-y-4">
                <button className="w-full px-4 py-3 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition text-sm font-medium">
                  退出登录
                </button>
                
                <button className="w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-sm font-medium">
                  删除账户
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
} 