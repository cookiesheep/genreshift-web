module.exports = {

"[project]/.next-internal/server/app/api/transform/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/axios [external] (axios, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/app/api/transform/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "POST": (()=>POST),
    "config": (()=>config)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
// 减少超时时间以适应Vercel环境限制
const TIMEOUT_MS = 25000; // 减少到25秒，避免Vercel的30秒限制
// 简单的内存缓存，避免重复请求相同内容
const responseCache = new Map();
// 缓存清理时间（10分钟）
const CACHE_EXPIRY = 10 * 60 * 1000;
const config = {
    runtime: 'edge',
    regions: [
        'hkg1'
    ],
    maxDuration: 60
};
// 处理单个文本段落的函数
async function processTextSegment(content, parameters, segmentIndex, totalSegments) {
    // 创建缓存键（内容+参数组合）
    const cacheKey = JSON.stringify({
        content: content.substring(0, 50) + content.length,
        parameters,
        segmentIndex
    });
    // 检查缓存
    if (responseCache.has(cacheKey)) {
        console.log(`使用缓存结果，节省API调用 (段落 ${segmentIndex + 1}/${totalSegments})`);
        return responseCache.get(cacheKey);
    }
    // 获取环境变量中的API密钥和URL
    const API_KEY = ("TURBOPACK compile-time value", "sk-1f660ec6e1584c83825ffeed4b838523") || "sk-1f660ec6e1584c83825ffeed4b838523";
    const API_URL = ("TURBOPACK compile-time value", "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions") || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    // 根据段落位置调整提示词
    let segmentContext = '';
    if (totalSegments > 1) {
        if (segmentIndex === 0) {
            segmentContext = '这是文章的第一部分，请重点关注开头内容。';
        } else if (segmentIndex === totalSegments - 1) {
            segmentContext = '这是文章的最后一部分，请重点关注结论和总结。';
        } else {
            segmentContext = `这是文章的第${segmentIndex + 1}部分，请保持与前后文的连贯性。`;
        }
    }
    const prompt = `
${segmentContext}
将下面的学术论文内容（${content.length}字）转为${parameters.length === 'short' ? '300字左右' : parameters.length === 'medium' ? '500字左右' : '800字左右'}的${parameters.outputStyle === 'news' ? '新闻报道' : parameters.outputStyle === 'blog' ? '博客文章' : '摘要总结'}，使用${parameters.language === 'zh' ? '中文' : '英文'}，重点关注${parameters.focus === 'general' ? '综合内容' : parameters.focus === 'methodology' ? '研究方法' : parameters.focus === 'results' ? '研究结果' : '研究意义'}：

${content}
  `;
    const controller = new AbortController();
    const timeoutId = setTimeout(()=>controller.abort(), TIMEOUT_MS);
    const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(API_URL, {
        model: "qwen-turbo",
        messages: [
            {
                role: 'system',
                content: '您是一位专门将学术内容转化为通俗易懂格式的专家。回答简洁直接，不需要废话。'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_tokens: parameters.length === 'short' ? 500 : parameters.length === 'medium' ? 800 : 1200,
        temperature: 0.3
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        timeout: TIMEOUT_MS,
        signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (response.data && response.data.choices && response.data.choices[0]) {
        const result = response.data.choices[0].message.content;
        // 保存到缓存
        responseCache.set(cacheKey, result);
        // 设置缓存自动过期
        setTimeout(()=>{
            responseCache.delete(cacheKey);
        }, CACHE_EXPIRY);
        return result;
    } else {
        throw new Error("API返回格式异常");
    }
}
// 添加重试机制
const retryRequest = async (fn, retries = 3)=>{
    for(let i = 0; i < retries; i++){
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`Retry attempt ${i + 1} failed, retrying...`);
            await new Promise((resolve)=>setTimeout(resolve, 1000 * (i + 1)));
        }
    }
};
async function POST(request) {
    try {
        const { content, parameters } = await request.json();
        if (!content) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '内容不能为空'
            }, {
                status: 400
            });
        }
        if (content.length > 2000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '内容长度超过限制，请分段处理'
            }, {
                status: 400
            });
        }
        const response = await retryRequest(async ()=>{
            const result = await processTextSegment(content, parameters, 0, 1);
            return {
                result
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response);
    } catch (error) {
        console.error('API Error:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            data: error.response?.data
        });
        if (error.response) {
            // 处理特定的错误状态码
            switch(error.response.status){
                case 401:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: 'API密钥无效或已过期'
                    }, {
                        status: 401
                    });
                case 429:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '请求过于频繁，请稍后再试'
                    }, {
                        status: 429
                    });
                case 408:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '请求超时，请重试'
                    }, {
                        status: 408
                    });
                default:
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                        error: '服务器处理请求时出错'
                    }, {
                        status: error.response.status
                    });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: '服务器内部错误'
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__fc340966._.js.map