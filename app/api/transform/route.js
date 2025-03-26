import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    console.log('=========== API调用开始 ===========');
    const { content, parameters } = await request.json();
    
    // 内容处理
    const contentLimit = 5000;
    const processedContent = content.substring(0, contentLimit);
    
    console.log('内容长度:', processedContent.length);
    console.log('内容前100个字符:', processedContent.substring(0, 100));
    console.log('参数:', JSON.stringify(parameters));
    
    if (!processedContent) {
      return NextResponse.json(
        { error: "请提供论文内容" },
        { status: 400 }
      );
    }
    
    // 测试API密钥是否有效
    try {
      console.log('发送测试请求检查API密钥');
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
    `;
    
    // API调用配置
    const apiKey = process.env.DASHSCOPE_API_KEY || "sk-364edeb5190543d1ba2d5127d4428e47";
    const apiUrl = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
    
    console.log('发送主请求到API');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 30秒超时
    
    try {
      console.log('接收到API请求，内容长度:', content.length);
      console.log('参数:', JSON.stringify(parameters));
      
      // 确保内容不为空
      if (!content || content.trim().length === 0) {
        return NextResponse.json(
          { error: "请提供有效的论文内容" },
          { status: 400 }
        );
      }

      // 添加其他参数验证...
      
      const response = await axios.post(apiUrl, {
        model: "qwen-max",
        messages: [
          {role: 'system', content: 'You are a helpful assistant.'},
          {role: 'user', content: prompt}
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('收到API响应:', JSON.stringify(response.data).substring(0, 200) + '...');
      
      // 处理结果
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
      console.error('API请求URL:', apiUrl);
      console.error('请求参数:', { 
        model: "qwen-plus", 
        messages: [
          {role: 'system', content: 'You are a helpful assistant.'},
          {role: 'user', content: prompt.substring(0, 100) + '...'} // 打印前100个字符
        ]
      });
      
      if (apiError.response) {
        console.error('状态码:', apiError.response.status);
        console.error('响应头:', JSON.stringify(apiError.response.headers));
        console.error('响应数据:', apiError.response.data);
      } else if (apiError.request) {
        console.error('请求已发送但没有收到响应');
      } else {
        console.error('请求设置错误:', apiError.message);
      }
      
      // 重新抛出或返回模拟响应
      return NextResponse.json({
        result: `# 转换结果（模拟）\n\n## 科技新闻\n\n**突破性研究揭示新发现**\n\n研究人员最近发表了一项关于${parameters.focus}的重要研究。这项研究采用了创新方法，得出了令人振奋的结果。\n\n据研究团队介绍，这一发现可能对未来的科技发展产生深远影响。\n\n此研究发表在著名期刊上，引起了学术界的广泛关注。`
      });
    }
    
  } catch (error) {
    console.error('API错误详情:', error);
    console.error('错误堆栈:', error.stack);
    
    return NextResponse.json(
      { error: error.message || "服务器处理错误" },
      { status: 500 }
    );
  }
} 