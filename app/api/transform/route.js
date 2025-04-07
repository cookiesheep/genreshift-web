import { NextResponse } from 'next/server';
import axios from 'axios';

// 设置更短的超时时间，适应Vercel环境
const TIMEOUT_MS = 50000; // 50秒，留些余量

// 简单的内存缓存，避免重复请求相同内容
const responseCache = new Map();
// 缓存清理时间（10分钟）
const CACHE_EXPIRY = 10 * 60 * 1000;

// 导出配置，设置为Edge Runtime以获得更长的执行时间
export const config = {
  runtime: 'edge',
};

export async function POST(request) {
  try {
    console.log('=========== API调用开始 ===========');
    const start = Date.now();
    const { content, parameters } = await request.json();
    
    // 内容处理 - 缩短长度进一步提高速度
    const contentLimit = 4000; // 减少到4000字符
    const processedContent = content.substring(0, contentLimit);
    
    // 创建缓存键（内容+参数组合）
    const cacheKey = JSON.stringify({
      content: processedContent.substring(0, 100) + processedContent.length, // 只用前100字符+长度作为内容标识
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
    
    console.log('内容长度:', processedContent.length);
    console.log('参数:', JSON.stringify(parameters));
    
    if (!processedContent) {
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
    
    // 构建提示词
    const prompt = `
请将以下学术论文内容转换为易读的科技新闻格式：

【论文内容】
${processedContent}

【输出要求】
风格：${parameters.outputStyle === 'news' ? '新闻报道' : parameters.outputStyle === 'blog' ? '博客文章' : '摘要总结'}
长度：${parameters.length === 'short' ? '简短(300字左右)' : parameters.length === 'medium' ? '中等(500字左右)' : '详细(800字左右)'}
重点关注：${parameters.focus === 'general' ? '综合内容' : parameters.focus === 'methodology' ? '研究方法' : parameters.focus === 'results' ? '研究结果' : '研究意义'}
语言：${parameters.language === 'zh' ? '中文' : '英文'}

请确保转换后的文章结构清晰，语言流畅，保留原文的关键信息，但使其更易于普通读者理解。
    `;
    
    console.log('发送请求到API');
    
    try {
      // 使用较轻量级的模型提高响应速度
      const selectedModel = parameters.length === 'long' ? "qwen-max" : "qwen-plus";
      console.log(`选择模型: ${selectedModel}`);
      
      // 直接发送主请求，跳过测试请求以减少超时风险
      const response = await axios.post(API_URL, {
        model: selectedModel,
        messages: [
          {role: 'system', content: 'You are a helpful assistant specialized in summarizing academic content to make it accessible to general audiences.'},
          {role: 'user', content: prompt}
        ],
        // 添加max_tokens参数限制响应长度，加快响应速度
        max_tokens: parameters.length === 'short' ? 800 : (parameters.length === 'medium' ? 1200 : 2000),
        // 调整温度让输出更加稳定
        temperature: 0.7,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: TIMEOUT_MS, // 设置axios超时
      });
      
      console.log('收到API响应，处理时间:', Date.now() - start, 'ms');
      
      // 处理结果
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
        console.error('API返回格式异常:', JSON.stringify(response.data));
        throw new Error("API返回格式异常");
      }
    } catch (apiError) {
      console.error('API请求错误:', apiError.message);
      
      // 改进错误处理，提供更具体的错误信息
      let errorMessage = "API请求失败";
      let statusCode = 500;
      
      if (apiError.code === 'ECONNABORTED' || apiError.message.includes('timeout')) {
        errorMessage = "API请求超时，请稍后再试或减少输入内容";
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