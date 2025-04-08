'use client';

// 本地存储键名称常量
const STORAGE_KEYS = {
  HISTORY: 'genreshift-history',
  USER_SETTINGS: 'genreshift-settings',
  THEME: 'theme',
  API_USAGE: 'genreshift-api-usage',
  RECENT_FILES: 'genreshift-recent-files'
};

/**
 * 统一的错误处理函数
 * @param {string} functionName 函数名称
 * @param {Error} error 错误对象
 * @param {*} defaultValue 默认返回值
 * @returns {*} 默认返回值
 */
const handleError = (functionName, error, defaultValue) => {
  console.error(`[LocalStorageManager] ${functionName} 失败:`, error);
  return defaultValue;
};

/**
 * 判断当前环境是否为浏览器
 * @returns {boolean} 是否为浏览器环境
 */
const isBrowser = () => typeof window !== 'undefined';

/**
 * 添加或更新历史记录
 * @param {Object} item 历史记录项目
 * @returns {string|null} 记录ID或null（失败时）
 */
export const saveToHistory = (item) => {
  if (!isBrowser()) return null;
  
  try {
    // 确保必需字段存在
    if (!item.title || !item.content) {
      console.error('[LocalStorageManager] 保存历史记录失败：标题或内容缺失');
      return null;
    }
    
    // 创建唯一ID
    const id = item.id || `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 获取现有历史记录
    const historyItems = getHistoryItems();
    
    // 准备新记录
    const newItem = {
      id,
      title: item.title,
      originalFileName: item.originalFileName || '未命名文件',
      date: item.date || new Date().toISOString().slice(0, 10),
      outputStyle: item.outputStyle || 'summary',
      previewText: item.content.substring(0, 150) + '...',
      content: item.content,
      tags: item.tags || [],
    };
    
    // 检查是否存在相同ID的记录，如果存在则更新，否则添加新记录
    const existingIndex = historyItems.findIndex(hist => hist.id === id);
    if (existingIndex >= 0) {
      historyItems[existingIndex] = newItem;
    } else {
      historyItems.unshift(newItem); // 添加到最前面
    }
    
    // 获取用户设置的最大历史记录数量，默认为50
    const settings = getUserSettings();
    const maxHistoryItems = settings.preferences?.maxHistoryItems || 50;
    
    // 限制存储数量
    const limitedItems = historyItems.slice(0, maxHistoryItems);
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedItems));
    
    return id;
  } catch (error) {
    return handleError('saveToHistory', error, null);
  }
};

/**
 * 获取所有历史记录
 * @returns {Array} 历史记录数组
 */
export const getHistoryItems = () => {
  if (!isBrowser()) return [];
  
  try {
    const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    return handleError('getHistoryItems', error, []);
  }
};

/**
 * 获取单个历史记录
 * @param {string} id 记录ID
 * @returns {Object|null} 历史记录对象或null
 */
export const getHistoryItem = (id) => {
  if (!isBrowser()) return null;
  
  try {
    const historyItems = getHistoryItems();
    return historyItems.find(item => item.id === id) || null;
  } catch (error) {
    return handleError('getHistoryItem', error, null);
  }
};

/**
 * 删除单个历史记录
 * @param {string} id 记录ID
 * @returns {boolean} 删除是否成功
 */
export const deleteHistoryItem = (id) => {
  if (!isBrowser()) return false;
  
  try {
    let historyItems = getHistoryItems();
    const initialLength = historyItems.length;
    
    historyItems = historyItems.filter(item => item.id !== id);
    
    if (historyItems.length !== initialLength) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyItems));
      return true;
    }
    return false;
  } catch (error) {
    return handleError('deleteHistoryItem', error, false);
  }
};

/**
 * 删除多个历史记录
 * @param {Array} ids 记录ID数组
 * @returns {number} 成功删除的数量
 */
export const deleteHistoryItems = (ids) => {
  if (!isBrowser()) return 0;
  if (!ids || !ids.length) return 0;
  
  try {
    let historyItems = getHistoryItems();
    const initialLength = historyItems.length;
    
    historyItems = historyItems.filter(item => !ids.includes(item.id));
    
    const deletedCount = initialLength - historyItems.length;
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyItems));
    
    return deletedCount;
  } catch (error) {
    return handleError('deleteHistoryItems', error, 0);
  }
};

/**
 * 清空所有历史记录
 * @returns {boolean} 清空是否成功
 */
export const clearAllHistory = () => {
  if (!isBrowser()) return false;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch (error) {
    return handleError('clearAllHistory', error, false);
  }
};

/**
 * 保存用户设置
 * @param {Object} settings 设置对象
 * @returns {boolean} 保存是否成功
 */
export const saveUserSettings = (settings) => {
  if (!isBrowser()) return false;
  
  try {
    // 获取现有设置
    const currentSettings = getUserSettings();
    
    // 合并新设置
    const updatedSettings = { ...currentSettings, ...settings };
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updatedSettings));
    return true;
  } catch (error) {
    return handleError('saveUserSettings', error, false);
  }
};

/**
 * 获取用户设置
 * @returns {Object} 用户设置对象
 */
export const getUserSettings = () => {
  if (!isBrowser()) {
    return getDefaultSettings();
  }
  
  try {
    const settingsData = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    
    // 如果找不到设置或解析失败，返回默认设置
    if (!settingsData) {
      return getDefaultSettings();
    }
    
    return { ...getDefaultSettings(), ...JSON.parse(settingsData) };
  } catch (error) {
    return handleError('getUserSettings', error, getDefaultSettings());
  }
};

/**
 * 获取默认设置
 * @returns {Object} 默认设置对象
 */
export const getDefaultSettings = () => {
  return {
    userInfo: {
      name: '用户',
      email: '',
    },
    preferences: {
      defaultOutputStyle: 'news',
      defaultLength: 'medium',
      defaultFocus: 'general',
      defaultLanguage: 'zh',
      apiModel: 'qwen-turbo',
      maxHistoryItems: 50,
    },
    saveHistory: true,
    darkMode: false,
    joinDate: new Date().toISOString().slice(0, 10),
  };
};

/**
 * 获取主题模式（暗色/亮色）
 * @returns {boolean} 是否为暗色模式
 */
export const getDarkMode = () => {
  if (!isBrowser()) return false;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
  } catch (error) {
    return handleError('getDarkMode', error, false);
  }
};

/**
 * 设置主题模式（暗色/亮色）
 * @param {boolean} isDark 是否为暗色模式
 * @returns {boolean} 设置是否成功
 */
export const setDarkMode = (isDark) => {
  if (!isBrowser()) return false;
  
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
    return true;
  } catch (error) {
    return handleError('setDarkMode', error, false);
  }
};

/**
 * 获取API使用统计
 * @returns {Object} API使用统计对象
 */
export const getApiUsage = () => {
  if (!isBrowser()) return { count: 0, lastReset: new Date().toISOString() };
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.API_USAGE);
    if (!data) {
      const defaultData = { count: 0, lastReset: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(data);
  } catch (error) {
    return handleError('getApiUsage', error, { count: 0, lastReset: new Date().toISOString() });
  }
};

/**
 * 增加API使用次数
 * @returns {Object} 更新后的API使用统计
 */
export const incrementApiUsage = () => {
  if (!isBrowser()) return { count: 0, lastReset: new Date().toISOString() };
  
  try {
    const usage = getApiUsage();
    usage.count += 1;
    localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(usage));
    return usage;
  } catch (error) {
    return handleError('incrementApiUsage', error, { count: 0, lastReset: new Date().toISOString() });
  }
};

/**
 * 重置API使用统计
 * @returns {Object} 重置后的API使用统计
 */
export const resetApiUsage = () => {
  if (!isBrowser()) return { count: 0, lastReset: new Date().toISOString() };
  
  try {
    const resetData = { count: 0, lastReset: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(resetData));
    return resetData;
  } catch (error) {
    return handleError('resetApiUsage', error, { count: 0, lastReset: new Date().toISOString() });
  }
};

/**
 * 获取最近使用的文件列表
 * @returns {Array} 文件列表
 */
export const getRecentFiles = () => {
  if (!isBrowser()) return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECENT_FILES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return handleError('getRecentFiles', error, []);
  }
};

/**
 * 添加最近使用的文件
 * @param {Object} file 文件对象，包含name, size, type等信息
 * @returns {Array} 更新后的文件列表
 */
export const addRecentFile = (file) => {
  if (!isBrowser()) return [];
  if (!file || !file.name) return getRecentFiles();
  
  try {
    const files = getRecentFiles();
    
    // 创建新的文件记录
    const newFile = {
      name: file.name,
      size: file.size || 0,
      type: file.type || 'unknown',
      lastUsed: new Date().toISOString()
    };
    
    // 检查是否已经存在同名文件，如果存在则更新
    const existingIndex = files.findIndex(f => f.name === file.name);
    if (existingIndex >= 0) {
      files[existingIndex] = newFile;
    } else {
      files.unshift(newFile);
    }
    
    // 只保留最近的10个文件
    const limitedFiles = files.slice(0, 10);
    
    localStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(limitedFiles));
    return limitedFiles;
  } catch (error) {
    return handleError('addRecentFile', error, getRecentFiles());
  }
};

/**
 * 保存历史记录
 * @param {Object} record 历史记录对象
 * @returns {boolean} 保存是否成功
 */
export const saveToHistoryRecord = (record) => {
  if (!isBrowser()) return false;
  
  try {
    // 确保必需字段存在
    if (!record.title || !record.content) {
      console.error('[LocalStorageManager] 保存历史记录失败：标题或内容缺失');
      return false;
    }
    
    // 创建唯一ID
    const id = record.id || `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // 获取现有历史记录
    const historyItems = getHistoryItems();
    
    // 准备新记录
    const newItem = {
      id,
      title: record.title,
      originalFileName: record.originalFileName || '未命名文件',
      date: record.date || new Date().toISOString().slice(0, 10),
      outputStyle: record.outputStyle || 'summary',
      previewText: record.content.substring(0, 150) + '...',
      content: record.content,
      tags: record.tags || [],
    };
    
    // 检查是否存在相同ID的记录，如果存在则更新，否则添加新记录
    const existingIndex = historyItems.findIndex(hist => hist.id === id);
    if (existingIndex >= 0) {
      historyItems[existingIndex] = newItem;
    } else {
      historyItems.unshift(newItem); // 添加到最前面
    }
    
    // 获取用户设置的最大历史记录数量，默认为50
    const settings = getUserSettings();
    const maxHistoryItems = settings.preferences?.maxHistoryItems || 50;
    
    // 限制存储数量
    const limitedItems = historyItems.slice(0, maxHistoryItems);
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(limitedItems));
    
    return true;
  } catch (error) {
    return handleError('saveToHistoryRecord', error, false);
  }
};

// 导出所有功能
export default {
  saveToHistory,
  getHistoryItems,
  getHistoryItem,
  deleteHistoryItem,
  deleteHistoryItems,
  clearAllHistory,
  saveUserSettings,
  getUserSettings,
  getDefaultSettings,
  getDarkMode,
  setDarkMode,
  getApiUsage,
  incrementApiUsage,
  resetApiUsage,
  getRecentFiles,
  addRecentFile,
  saveToHistoryRecord
}; 