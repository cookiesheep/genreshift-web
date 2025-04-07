import { NextResponse } from 'next/server';
import axios from 'axios';

// 减少超时时间以适应Vercel环境限制
const TIMEOUT_MS = 25000; // 减少到25秒，避免Vercel的30秒限制

// 简单的内存缓存，避免重复请求相同内容
const responseCache = new Map();
// 缓存清理时间（10分钟）
const CACHE_EXPIRY = 10 * 60 * 1000;

// 导出配置，设置为Edge Runtime以获得更长的执行时间
export const config = {
  runtime: 'edge',
  regions: ['hkg1'], // 指定香港区域，提高中国用户访问速度
  maxDuration: 60, // 尝试设置最大执行时间
};

export async function POST(request) {
  try {
    console.log('=========== API调用开始 ===========');
    const start = Date.now();
    const { content, parameters } = await request.json();
    
    // 内容长度限制 - 大幅减少内容长度以避免超时
    const MAX_CONTENT_LENGTH = 2000; // 限制字符数
    const trimmedContent = content.substring(0, MAX_CONTENT_LENGTH);
    
    // 创建缓存键（内容+参数组合）
    const cacheKey = JSON.stringify({
      content: trimmedContent.substring(0, 50) + trimmedContent.length, // 只用前50字符+长度作为内容标识
      parameters
    });
    
    // 检查缓存
    if (responseCache.has(cacheKey)) {
      console.log('使用缓存结果，节省API调用');
      return NextResponse.json({
        result: responseCache.get(cacheKey),
        fromCache: true
      });
    }
    
    console.log('内容长度:', trimmedContent.length);
    console.log('参数:', JSON.stringify(parameters));
    
    if (!trimmedContent) {
      return NextResponse.json(
        { error: "请提供论文内容" },
        { status: 400 }
      );
    }
    
    // 获取环境变量中的API密钥和URL，如果不存在则使用默认值
    // 这样可以确保即使没有设置环境变量也能正常工作
    const API_KEY = process.env.DASHSCOPE_API_KEY || "sk-1f660ec6e1584c83825ffeed4b838523";
    const API_URL = process.env.DASHSCOPE_API_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API密钥未配置，请检查环境变量设置" },
        { status: 500 }
      );
    }

    // 简化提示词结构，减少处理复杂度
    const promptContent = `
将下面的学术论文内容（${trimmedContent.length}字）转为${parameters.length === 'short' ? '300字左右' : parameters.length === 'medium' ? '500字左右' : '800字左右'}的${parameters.outputStyle === 'news' ? '新闻报道' : parameters.outputStyle === 'blog' ? '博客文章' : '摘要总结'}，使用${parameters.language === 'zh' ? '中文' : '英文'}，重点关注${parameters.focus === 'general' ? '综合内容' : parameters.focus === 'methodology' ? '研究方法' : parameters.focus === 'results' ? '研究结果' : '研究意义'}：

${trimmedContent}
    `;
    
    console.log('发送请求到外部API');
    
    try {
      // 使用最轻量级的模型提高响应速度
      const selectedModel = "qwen-turbo"; // 使用速度最快的模型
      console.log(`选择模型: ${selectedModel}`);
      
      // 使用两层超时控制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      
      // 直接发送主请求，跳过测试请求以减少超时风险
      const response = await axios.post(API_URL, {
        model: selectedModel,
        messages: [
          {role: 'system', content: '您是一位专门将学术内容转化为通俗易懂格式的专家。回答简洁直接，不需要废话。'},
          {role: 'user', content: promptContent}
        ],
        // 减少token限制以获得更快的响应
        max_tokens: parameters.length === 'short' ? 500 : (parameters.length === 'medium' ? 800 : 1200),
        // 降低温度让输出更加稳定
        temperature: 0.3,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: TIMEOUT_MS, // 设置axios超时
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      console.log('收到外部API响应，处理时间:', Date.now() - start, 'ms');
      
      // 返回处理结果
      if (response.data && response.data.choices && response.data.choices[0]) {
        const result = response.data.choices[0].message.content;
        
        // 保存到缓存
        responseCache.set(cacheKey, result);
        // 设置缓存自动过期
        setTimeout(() => {
          responseCache.delete(cacheKey);
        }, CACHE_EXPIRY);
        
        return NextResponse.json({
          result: result
        });
      } else {
        console.error('API返回格式异常');
        throw new Error("API返回格式异常");
      }
    } catch (apiError) {
      console.error('API请求错误:', apiError.message);
      
      // 改进错误处理，提供更具体的错误信息
      let errorMessage = "API请求失败";
      let statusCode = 500;
      
      if (apiError.code === 'ECONNABORTED' || apiError.message.includes('timeout') || apiError.name === 'AbortError') {
        errorMessage = "API请求超时，已大幅减少内容长度，请重试或进一步缩短文本";
        statusCode = 504;
      } else if (apiError.response) {
        statusCode = apiError.response.status;
        errorMessage = `API响应错误(${statusCode}): ${JSON.stringify(apiError.response.data || {})}`;
      }
      
      // 错误日志增强
      console.error(`请求失败(${statusCode}): ${errorMessage}`);
      
      return NextResponse.json(
        { error: errorMessage },
        { status: statusCode }
      );
    }
    
  } catch (error) {
    console.error('服务器处理错误:', error.message);
    
    return NextResponse.json(
      { error: "服务器处理错误: " + (error.message || "未知错误") },
      { status: 500 }
    );
  }
} 