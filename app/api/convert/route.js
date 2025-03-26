import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    console.log('=========== API调用开始 ===========');
    const { content, parameters } = await request.json();
    
    // 内容长度限制 - 这里定义一次即可
    const MAX_CONTENT_LENGTH = 5000; // 限制字符数
    const trimmedContent = content.substring(0, MAX_CONTENT_LENGTH);
    
    console.log('内容长度:', trimmedContent.length);
    console.log('内容前100个字符:', trimmedContent.substring(0, 100));
    console.log('参数:', JSON.stringify(parameters));
    
    if (!trimmedContent) {
      return NextResponse.json(
        { error: "请提供论文内容" },
        { status: 400 }
      );
    }
    
    // 测试API密钥是否有效的简单请求
    try {
      console.log('发送简单测试请求到API检查密钥有效性');
      const testResponse = await axios.post("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
        model: "qwen-plus",
        messages: [
          {role: 'system', content: 'You are a helpful assistant.'},
          {role: 'user', content: 'Hello, are you working?'}
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-364edeb5190543d1ba2d5127d4428e47`
        }
      });
      console.log('测试响应:', JSON.stringify(testResponse.data).substring(0, 100));
    } catch (testError) {
      console.error('API密钥测试失败:', testError.message);
      if (testError.response) {
        console.error('测试响应状态:', testError.response.status);
        console.error('测试响应数据:', JSON.stringify(testError.response.data));
      }
      return NextResponse.json(
        { error: "API密钥测试失败，请检查您的API密钥" },
        { status: 500 }
      );
    }

    // 使用更简单明确的提示词
    const promptContent = `
请将以下学术论文内容转换为易读的科技新闻格式：

【论文内容】
${trimmedContent}

【输出要求】
风格：${parameters.outputStyle === 'news' ? '新闻报道' : parameters.outputStyle === 'blog' ? '博客文章' : '摘要总结'}
长度：${parameters.length === 'short' ? '简短(300字左右)' : parameters.length === 'medium' ? '中等(500字左右)' : '详细(800字左右)'}
重点关注：${parameters.focus === 'general' ? '综合内容' : parameters.focus === 'methodology' ? '研究方法' : parameters.focus === 'results' ? '研究结果' : '研究意义'}
语言：${parameters.language === 'zh' ? '中文' : '英文'}
    `;
    
    // API调用设置
    const API_KEY = "sk-364edeb5190543d1ba2d5127d4428e47";
    const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    
    console.log('发送请求到外部API');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时
    
    try {
      const response = await axios.post(API_URL, {
        model: "qwen-plus",
        messages: [
          {role: 'system', content: 'You are a helpful assistant.'},
          {role: 'user', content: promptContent}
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('收到外部API响应:', JSON.stringify(response.data).substring(0, 200) + '...');
      
      // 返回处理结果
      if (response.data && response.data.choices && response.data.choices[0]) {
        return NextResponse.json({
          result: response.data.choices[0].message.content
        });
      } else {
        console.error('API返回格式异常:', JSON.stringify(response.data));
        throw new Error("API返回格式异常");
      }
    } catch (apiError) {
      console.error('API请求错误:', apiError.message);
      if (apiError.config) {
        console.error('API请求详情:', apiError.config);
      }
      if (apiError.response) {
        console.error('API响应状态:', apiError.response.status);
        console.error('API响应数据:', apiError.response.data);
      }
      throw apiError; // 重新抛出以便外层catch捕获
    }
    
  } catch (error) {
    console.error('API调用详细错误:', error);
    
    // 改进错误处理
    const errorMessage = error.code === 'ECONNABORTED' 
      ? "API请求超时，请稍后再试" 
      : error.message || "转换过程发生错误";
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 