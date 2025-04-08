(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app_0491568d._.js", {

"[project]/app/utils/localStorageManager.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "addRecentFile": (()=>addRecentFile),
    "clearAllHistory": (()=>clearAllHistory),
    "default": (()=>__TURBOPACK__default__export__),
    "deleteHistoryItem": (()=>deleteHistoryItem),
    "deleteHistoryItems": (()=>deleteHistoryItems),
    "getApiUsage": (()=>getApiUsage),
    "getDarkMode": (()=>getDarkMode),
    "getDefaultSettings": (()=>getDefaultSettings),
    "getHistoryItem": (()=>getHistoryItem),
    "getHistoryItems": (()=>getHistoryItems),
    "getRecentFiles": (()=>getRecentFiles),
    "getUserSettings": (()=>getUserSettings),
    "incrementApiUsage": (()=>incrementApiUsage),
    "resetApiUsage": (()=>resetApiUsage),
    "saveToHistory": (()=>saveToHistory),
    "saveToHistoryRecord": (()=>saveToHistoryRecord),
    "saveUserSettings": (()=>saveUserSettings),
    "setDarkMode": (()=>setDarkMode)
});
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
 */ const handleError = (functionName, error, defaultValue)=>{
    console.error(`[LocalStorageManager] ${functionName} 失败:`, error);
    return defaultValue;
};
/**
 * 判断当前环境是否为浏览器
 * @returns {boolean} 是否为浏览器环境
 */ const isBrowser = ()=>"object" !== 'undefined';
const saveToHistory = (item)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
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
            tags: item.tags || []
        };
        // 检查是否存在相同ID的记录，如果存在则更新，否则添加新记录
        const existingIndex = historyItems.findIndex((hist)=>hist.id === id);
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
const getHistoryItems = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const historyData = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return historyData ? JSON.parse(historyData) : [];
    } catch (error) {
        return handleError('getHistoryItems', error, []);
    }
};
const getHistoryItem = (id)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const historyItems = getHistoryItems();
        return historyItems.find((item)=>item.id === id) || null;
    } catch (error) {
        return handleError('getHistoryItem', error, null);
    }
};
const deleteHistoryItem = (id)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        let historyItems = getHistoryItems();
        const initialLength = historyItems.length;
        historyItems = historyItems.filter((item)=>item.id !== id);
        if (historyItems.length !== initialLength) {
            localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyItems));
            return true;
        }
        return false;
    } catch (error) {
        return handleError('deleteHistoryItem', error, false);
    }
};
const deleteHistoryItems = (ids)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    if (!ids || !ids.length) return 0;
    try {
        let historyItems = getHistoryItems();
        const initialLength = historyItems.length;
        historyItems = historyItems.filter((item)=>!ids.includes(item.id));
        const deletedCount = initialLength - historyItems.length;
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(historyItems));
        return deletedCount;
    } catch (error) {
        return handleError('deleteHistoryItems', error, 0);
    }
};
const clearAllHistory = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        localStorage.removeItem(STORAGE_KEYS.HISTORY);
        return true;
    } catch (error) {
        return handleError('clearAllHistory', error, false);
    }
};
const saveUserSettings = (settings)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        // 获取现有设置
        const currentSettings = getUserSettings();
        // 合并新设置
        const updatedSettings = {
            ...currentSettings,
            ...settings
        };
        // 保存到本地存储
        localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updatedSettings));
        return true;
    } catch (error) {
        return handleError('saveUserSettings', error, false);
    }
};
const getUserSettings = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const settingsData = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
        // 如果找不到设置或解析失败，返回默认设置
        if (!settingsData) {
            return getDefaultSettings();
        }
        return {
            ...getDefaultSettings(),
            ...JSON.parse(settingsData)
        };
    } catch (error) {
        return handleError('getUserSettings', error, getDefaultSettings());
    }
};
const getDefaultSettings = ()=>{
    return {
        userInfo: {
            name: '用户',
            email: ''
        },
        preferences: {
            defaultOutputStyle: 'news',
            defaultLength: 'medium',
            defaultFocus: 'general',
            defaultLanguage: 'zh',
            apiModel: 'qwen-turbo',
            maxHistoryItems: 50
        },
        saveHistory: true,
        darkMode: false,
        joinDate: new Date().toISOString().slice(0, 10)
    };
};
const getDarkMode = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) === 'dark';
    } catch (error) {
        return handleError('getDarkMode', error, false);
    }
};
const setDarkMode = (isDark)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', isDark);
        return true;
    } catch (error) {
        return handleError('setDarkMode', error, false);
    }
};
const getApiUsage = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const data = localStorage.getItem(STORAGE_KEYS.API_USAGE);
        if (!data) {
            const defaultData = {
                count: 0,
                lastReset: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(defaultData));
            return defaultData;
        }
        return JSON.parse(data);
    } catch (error) {
        return handleError('getApiUsage', error, {
            count: 0,
            lastReset: new Date().toISOString()
        });
    }
};
const incrementApiUsage = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const usage = getApiUsage();
        usage.count += 1;
        localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(usage));
        return usage;
    } catch (error) {
        return handleError('incrementApiUsage', error, {
            count: 0,
            lastReset: new Date().toISOString()
        });
    }
};
const resetApiUsage = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const resetData = {
            count: 0,
            lastReset: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.API_USAGE, JSON.stringify(resetData));
        return resetData;
    } catch (error) {
        return handleError('resetApiUsage', error, {
            count: 0,
            lastReset: new Date().toISOString()
        });
    }
};
const getRecentFiles = ()=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
    try {
        const data = localStorage.getItem(STORAGE_KEYS.RECENT_FILES);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        return handleError('getRecentFiles', error, []);
    }
};
const addRecentFile = (file)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
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
        const existingIndex = files.findIndex((f)=>f.name === file.name);
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
const saveToHistoryRecord = (record)=>{
    if (!isBrowser()) {
        "TURBOPACK unreachable";
    }
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
            tags: record.tags || []
        };
        // 检查是否存在相同ID的记录，如果存在则更新，否则添加新记录
        const existingIndex = historyItems.findIndex((hist)=>hist.id === id);
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
const __TURBOPACK__default__export__ = {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/help/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>Help)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$localStorageManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/localStorageManager.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Help() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('guide');
    const [darkMode, setDarkModeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // 初始加载
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Help.useEffect": ()=>{
            // 读取暗色模式状态
            const savedMode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$localStorageManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDarkMode"])();
            setDarkModeState(savedMode);
            document.documentElement.classList.toggle('dark', savedMode);
        }
    }["Help.useEffect"], []);
    // 切换深色模式
    const toggleDarkMode = ()=>{
        const newMode = !darkMode;
        setDarkModeState(newMode);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$localStorageManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDarkMode"])(newMode);
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
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "GenreShift 是一个将学术论文转换为易于理解的格式的工具。它使用人工智能技术，帮助您更轻松地理解复杂的学术内容。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 69,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "使用 GenreShift 只需几个简单步骤："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 72,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                        className: "list-decimal pl-6 mb-6 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "访问",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/workspace",
                                        className: "text-indigo-600 dark:text-indigo-400 hover:underline",
                                        children: "工作台"
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 74,
                                        columnNumber: 19
                                    }, this),
                                    "页面"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "上传PDF格式的学术论文或者输入文本内容"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "选择输出样式（新闻、博客或摘要）"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "选择关注点和语言"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 77,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: '点击"转换"按钮'
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "等待片刻，查看转换结果"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 79,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 73,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: [
                            "转换完成后，您可以复制、分享或保存结果。所有历史转换记录都会保存在",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/history",
                                className: "text-indigo-600 dark:text-indigo-400 hover:underline",
                                children: "历史记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 81,
                                columnNumber: 47
                            }, this),
                            "页面。"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 81,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        },
        {
            title: "上传文件指南",
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "GenreShift 支持以下文件类型："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "PDF 文件（学术论文、研究报告等）"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "TXT 文本文件"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 90,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "上传文件时请注意："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 94,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "文件大小不应超过10MB"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 96,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "PDF文件应确保文本可选择（非扫描图像）"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "文本长度不应超过25,000字符，超出部分将被截断"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 98,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "含有过多公式、表格或图表的文件可能会影响转换质量"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 99,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "您也可以直接复制粘贴文本内容到输入框，而不用上传文件。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        },
        {
            title: "输出样式说明",
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4",
                        children: "GenreShift 提供三种不同的输出样式，以满足不同的阅读需求："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 109,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "新闻风格"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700",
                        children: "以客观、简明的方式呈现论文内容，类似于新闻报道。重点突出研究的主要发现和重要信息，适合需要快速了解研究概况的读者。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "博客风格"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700",
                        children: "采用更加个性化、生动的表达方式，使内容更加易读和有趣。加入更多解释性内容和背景信息，适合希望深入但轻松理解研究内容的读者。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "摘要风格"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4 pl-4 border-l-2 border-indigo-300 dark:border-indigo-700",
                        children: "提供简洁扼要的研究概述，重点突出论文的主要观点、方法和结论。适合需要快速把握论文核心内容的读者。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "您可以根据自己的需求和偏好选择合适的输出样式。也可以在个人中心设置默认的输出样式。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        },
        {
            title: "历史记录管理",
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4",
                        children: "GenreShift 会自动保存您的转换历史记录，方便您随时查看和管理。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 134,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "查看历史记录"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 136,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: [
                            "访问",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/history",
                                className: "text-indigo-600 dark:text-indigo-400 hover:underline",
                                children: "历史记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 138,
                                columnNumber: 15
                            }, this),
                            "页面可以查看所有之前转换过的内容。历史记录按时间倒序排列，最新的转换结果显示在最前面。"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 137,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "管理历史记录"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "在历史记录页面，您可以："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 142,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "查看完整的转换结果"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 144,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "删除单条历史记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "清空所有历史记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "按文件名、日期或内容类型筛选记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 147,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "对历史记录进行排序"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 148,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 143,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "历史记录存储"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 151,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "所有历史记录都保存在浏览器的本地存储中。请注意以下几点："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "清除浏览器缓存会导致历史记录丢失"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "历史记录只能在当前设备和浏览器中访问"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "您可以在个人中心设置历史记录的最大保存数量"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 158,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "在未来的版本中，我们计划添加云端同步功能，让您可以在不同设备间同步历史记录。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        },
        {
            title: "隐私与数据安全",
            content: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-4",
                        children: "GenreShift 重视您的隐私和数据安全。以下是我们对您上传内容的处理方式："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 169,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "上传内容处理"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 171,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "您上传的文件仅用于转换处理，不会被永久存储在我们的服务器上"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "文件内容在处理完成后会立即从服务器中删除"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "转换结果仅保存在您的本地浏览器中"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "API 调用"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 178,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "我们使用第三方 AI 服务进行内容转换。在此过程中："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 179,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "您的内容会通过加密连接发送给 AI 服务提供商"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 183,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "内容不会被用于训练 AI 模型"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 184,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "所有通信均采用 HTTPS 加密协议"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 185,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 182,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-semibold mb-2 text-gray-800 dark:text-gray-200",
                        children: "本地存储"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "GenreShift 使用浏览器的本地存储功能来保存："
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "list-disc pl-6 mb-4 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "转换历史记录"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 193,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "用户偏好设置"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "界面主题选择"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 192,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-3",
                        children: "您可以随时删除这些本地存储数据，或者通过清除浏览器缓存完全移除所有数据。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "我们承诺保护您的数据安全，不会收集或共享您的个人信息或上传内容。"
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 dark:bg-gray-900",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-6 py-4 flex justify-between items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/",
                                    className: "text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 text-transparent bg-clip-text",
                                    children: "GenreShift"
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 214,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:flex space-x-6 text-gray-600 dark:text-gray-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/workspace",
                                            className: "hover:text-indigo-600 dark:hover:text-indigo-400 transition",
                                            children: "工作台"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 218,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/history",
                                            className: "hover:text-indigo-600 dark:hover:text-indigo-400 transition",
                                            children: "历史记录"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 219,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/help",
                                            className: "text-indigo-600 dark:text-indigo-400 transition",
                                            children: "帮助中心"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 220,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 217,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/help/page.js",
                            lineNumber: 213,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleDarkMode,
                                    className: "p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                                    children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-yellow-400",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 231,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 230,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-6 h-6 text-gray-600 dark:text-gray-300",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 235,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 234,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 225,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/profile",
                                    className: "flex items-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-medium",
                                        children: "U"
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 240,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/help/page.js",
                            lineNumber: 223,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/help/page.js",
                    lineNumber: 212,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/help/page.js",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container mx-auto px-6 py-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4",
                                children: "帮助中心"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 251,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 dark:text-gray-400",
                                children: "了解如何充分利用 GenreShift 的全部功能"
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 252,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 250,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex border-b border-gray-100 dark:border-gray-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'guide' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`,
                                        onClick: ()=>setActiveTab('guide'),
                                        children: "用户指南"
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 258,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `px-6 py-4 text-sm font-medium transition-colors duration-200 ${activeTab === 'faq' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`,
                                        onClick: ()=>setActiveTab('faq'),
                                        children: "常见问题"
                                    }, void 0, false, {
                                        fileName: "[project]/app/help/page.js",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 257,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-6",
                                children: activeTab === 'guide' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-10",
                                    children: userGuides.map((guide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                            initial: {
                                                opacity: 0,
                                                y: 20
                                            },
                                            animate: {
                                                opacity: 1,
                                                y: 0
                                            },
                                            transition: {
                                                duration: 0.4,
                                                delay: index * 0.1
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4",
                                                    children: guide.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/help/page.js",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-gray-700 dark:text-gray-300 leading-relaxed",
                                                    children: guide.content
                                                }, void 0, false, {
                                                    fileName: "[project]/app/help/page.js",
                                                    lineNumber: 292,
                                                    columnNumber: 21
                                                }, this),
                                                index < userGuides.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "border-b border-gray-100 dark:border-gray-700 mt-10"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/help/page.js",
                                                    lineNumber: 296,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 285,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 283,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700 dark:text-gray-300 mb-6",
                                            children: "以下是用户常见的问题和答案。如果您没有找到需要的信息，请联系我们的支持团队。"
                                        }, void 0, false, {
                                            fileName: "[project]/app/help/page.js",
                                            lineNumber: 303,
                                            columnNumber: 17
                                        }, this),
                                        faqs.map((faq, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                initial: {
                                                    opacity: 0,
                                                    y: 20
                                                },
                                                animate: {
                                                    opacity: 1,
                                                    y: 0
                                                },
                                                transition: {
                                                    duration: 0.3,
                                                    delay: index * 0.1
                                                },
                                                className: "bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-medium text-gray-800 dark:text-gray-100 mb-2",
                                                        children: faq.question
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/help/page.js",
                                                        lineNumber: 313,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-600 dark:text-gray-400",
                                                        children: faq.answer
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/help/page.js",
                                                        lineNumber: 314,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/app/help/page.js",
                                                lineNumber: 306,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 302,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/help/page.js",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl shadow-md overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-8 text-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-semibold mb-4",
                                    children: "需要更多帮助？"
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mb-6 opacity-90",
                                    children: "如果您在使用 GenreShift 时遇到任何问题，或者有改进建议，请随时联系我们的支持团队。"
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 326,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: "px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition",
                                    children: "联系我们"
                                }, void 0, false, {
                                    fileName: "[project]/app/help/page.js",
                                    lineNumber: 327,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/help/page.js",
                            lineNumber: 324,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/help/page.js",
                        lineNumber: 323,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/help/page.js",
                lineNumber: 249,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/help/page.js",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
_s(Help, "OPY6RDVZNuMyQ5fbQEofsI+LjfM=");
_c = Help;
var _c;
__turbopack_context__.k.register(_c, "Help");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=app_0491568d._.js.map